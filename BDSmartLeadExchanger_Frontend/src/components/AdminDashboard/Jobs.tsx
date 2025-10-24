"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScreenshotViewer } from "@/components/ui/screenshot-viewer";
import {
  PageHeaderSkeleton,
  SearchFilterSkeleton,
  TableSkeleton,
} from "@/components/ui/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ApprovedOrRejectJobs,
  deletedSubmission,
  getAlljobs,
} from "@/services/jobService";
import { ApprovedOrRejectSubmission } from "@/services/JobSubmission";
import {
  Calendar,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  Loader2,
  Search,
  Trash,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Submission {
  _id: string;
  job: string;
  user: string;
  proofScreenshots: string[];
  status: "submitted" | "approved" | "rejected";
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface MyJobItem {
  _id: string;
  title: string;
  description: string;
  jobUrl: string;
  screenshotTitles: string[];
  thumbnail: string;
  postedBy: string;
  approvedByAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  submissions: Submission[];
}

const MyJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm2, setSearchTerm2] = useState("");

  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [myJobsData, setMyJobsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [Loading, setLoading] = useState(true);
  // --- Add this state at top level ---
  const [submissions, setSubmissions] = useState<{ [key: string]: number }>({});

  // --- Replace your interval useEffect with this ---
  useEffect(() => {
    const timer = setInterval(() => {
      setSubmissions((prev) => {
        const updated: { [key: string]: number } = {};
        myJobsData.forEach((job) => {
          job.submissions.forEach((sub: any) => {
            if (sub.status === "submitted") {
              const submittedTime = new Date(sub.submittedAt).getTime();
              const deadline = submittedTime + 2 * 60 * 60 * 1000; // 2 hours
              const remaining = Math.floor((deadline - Date.now()) / 1000);

              if (remaining <= 0) {
                // Auto approve if time is over
                sub.status = "approved";
              } else {
                updated[sub._id] = remaining;
              }
            }
          });
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [myJobsData]);

  // --- Helper to format time ---
  const formatCountdown = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? `${h}h ` : ""}${m.toString().padStart(2, "0")}m ${s
      .toString()
      .padStart(2, "0")}s`;
  };

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getAlljobs();
      console.log(response);
      setMyJobsData(response.data || []);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get badge color based on submission status
  const getSubmissionStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success text-success-foreground">Approved</Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            Rejected
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-warning text-warning-foreground">
            Submitted
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getJobStatusBadge = (approvedByAdmin: boolean) => {
    return approvedByAdmin ? (
      <Badge className="bg-success text-success-foreground">Approved</Badge>
    ) : (
      <Badge className="bg-warning text-warning-foreground">Pending</Badge>
    );
  };

  const handleSubmissionAction = async (
    submissionId: string,
    action: "approve" | "reject"
  ) => {
    setLoading(true);
    const res = await ApprovedOrRejectSubmission(submissionId, action);
    if (res.success) {
      setLoading(false);
      toast.success(`${res.message}`);
      fetchData();
    } else {
      setLoading(false);

      toast.success(`${res.message}`);
    }
  };
  const handleJobAction = async (
    jobId: string,
    action: "approve" | "reject"
  ) => {
    const res = await ApprovedOrRejectJobs(jobId, action);
    if (res.success) {
      toast.success(`${res.message}`);
      fetchData();
      fetchData();
    } else {
      toast.success(`${res.message}`);
    }
  };
  const getSubmissionStats = (submissions: any[]) => {
    const total = submissions.length;
    const approved = submissions.filter((s) => s.status === "approved").length;
    const submitted = submissions.filter(
      (s) => s.status === "submitted"
    ).length;
    const rejected = submissions.filter((s) => s.status === "rejected").length;
    return { total, approved, submitted, rejected };
  };

  const filteredData = myJobsData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.postedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.postedBy.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  // NEW FUNCTION: Filters submissions by user name or email
  const getFilteredSubmissions = (job: any) => {
    if (!searchTerm2.trim()) {
      return job.submissions; // Return all if no search term
    }

    return job.submissions.filter((submission: any) => {
      const searchLower = searchTerm2.toLowerCase();
      return (
        submission.user.name.toLowerCase().includes(searchLower) ||
        submission.user.email.toLowerCase().includes(searchLower)
      );
    });
  };

  const handleDeleted = async (id: string) => {
    const res = await deletedSubmission(id);
    fetchData();
    console.log(res);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      {isLoading ? (
        <PageHeaderSkeleton />
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              My Jobs
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your posted jobs and track progress
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-muted animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                    <div className="h-5 w-8 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="font-semibold">{myJobsData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved Jobs</p>
                  <p className="font-semibold">
                    {myJobsData.filter((job) => job.approvedByAdmin).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Users className="h-4 w-4 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Submissions
                  </p>
                  <p className="font-semibold">
                    {myJobsData.reduce(
                      (acc, job) => acc + job.submissions.length,
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pending Reviews
                  </p>
                  <p className="font-semibold">
                    {myJobsData.reduce(
                      (acc, job) =>
                        acc +
                        job.submissions.filter(
                          (s: any) => s.status === "submitted"
                        ).length,
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      {isLoading ? (
        <SearchFilterSkeleton />
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs, Creator Email, Creator Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs List */}
      {isLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <div className="space-y-4">
          {filteredData.map((job) => {
            const filteredSubmissions = getFilteredSubmissions(job);
            const stats = getSubmissionStats(filteredSubmissions);
            const isExpanded = expandedJob === job._id;

            return (
              <Card key={job._id} className="overflow-hidden">
                <CardHeader>
                  <div className="md:flex space-y-2 md:space-y-0 items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        {getJobStatusBadge(job.approvedByAdmin)}
                      </div>
                      <p className="text-muted-foreground">
                        {job?.postedBy?.name}, {job?.postedBy?.email}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="h-3 w-3" />
                          <Link
                            href={`${job.jobUrl}`}
                            className="truncate max-w-[300px] cursor-pointer"
                          >
                            {job.jobUrl}
                          </Link>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>Total: {stats.total}</span>
                        <span className="text-success">✓ {stats.approved}</span>
                        <span className="text-warning">
                          ⏳ {stats.submitted}
                        </span>
                        <span className="text-destructive">
                          ✗ {stats.rejected}
                        </span>
                      </div>
                    </div>

                    <div className="md:flex space-y-2 md:space-y-0 items-center space-x-2">
                      {!job.approvedByAdmin && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleJobAction(job._id, "approve")}
                            className="bg-primary hover:bg-primary/80"
                          >
                            {Loading ? (
                              <>
                                <Loader2 />
                                Approving...
                              </>
                            ) : (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleJobAction(job._id, "reject")}
                          >
                            {Loading ? (
                              <>
                                <Loader2 />
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <X className="h-3 w-3 mr-1" />
                                Reject
                              </>
                            )}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Job
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl  h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                              <DialogHeader>
                                <DialogTitle> Job Information</DialogTitle>
                              </DialogHeader>
                              <div className="">
                                <Card>
                                  <CardContent className="space-y-2">
                                    <div>
                                      <span className="font-medium">
                                        Title:
                                      </span>
                                      <p className="text-muted-foreground">
                                        {job.title}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Description:
                                      </span>
                                      <p className="text-muted-foreground">
                                        {job.description}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Job URL:
                                      </span>
                                      <Link
                                        href={job.jobUrl}
                                        passHref
                                        legacyBehavior
                                      >
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-muted-foreground break-all"
                                        >
                                          {job.jobUrl}
                                        </a>
                                      </Link>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Screenshot Requirements:
                                      </span>
                                      <ul className="text-muted-foreground list-disc list-inside">
                                        {job.screenshotTitles.map(
                                          (title: any, index: any) => (
                                            <li key={index}>{title}</li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExpandedJob(isExpanded ? null : job._id)
                        }
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {isExpanded ? "Hide" : "View"} Submissions
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="border-t pt-4">
                      <div className="md:flex space-y-2 md:space-y-0 justify-between">
                        <h4 className="font-medium mb-4">
                          Submissions ({stats.total})
                        </h4>

                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search Submission Email, Submission Name..."
                            value={searchTerm2}
                            onChange={(e) => setSearchTerm2(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {filteredSubmissions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Submission ID</TableHead>
                                <TableHead>Submitter</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Remaining Time</TableHead>{" "}
                                {/* NEW */}
                                <TableHead>Proof Screenshots</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>Actions</TableHead>
                                <TableHead>Report Reason</TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {filteredSubmissions.map((submission: any) => (
                                <TableRow key={submission._id}>
                                  <TableCell className="font-mono text-sm">
                                    {submission._id}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {submission?.user?.name}{" "}
                                    {/* Show user name */}
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {submission?.user?.email}{" "}
                                    {/* Show user email */}
                                  </TableCell>
                                  <TableCell>
                                    {getSubmissionStatusBadge(
                                      submission?.status
                                    )}
                                  </TableCell>

                                  {/* Countdown Timer */}
                                  <TableCell className="text-sm">
                                    {submission.status === "submitted"
                                      ? submissions[submission._id] !==
                                        undefined
                                        ? formatCountdown(
                                            submissions[submission._id]
                                          )
                                        : "Auto Approved"
                                      : "--"}
                                  </TableCell>

                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm">
                                        {submission.proofScreenshots.length}{" "}
                                        files
                                      </span>
                                      {submission?.proofScreenshots?.length >
                                        0 && (
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                              <Eye className="h-3 w-3" />
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent className="max-w-6xl max-h-screen">
                                            <DialogHeader>
                                              <DialogTitle>
                                                Professional Screenshots
                                              </DialogTitle>
                                            </DialogHeader>
                                            <ScreenshotViewer
                                              screenshots={
                                                submission?.proofScreenshots
                                              }
                                              titles={job.screenshotTitles}
                                              professionalName={
                                                submission?.user?.email
                                              }
                                              professionalImage="/placeholder.svg"
                                              maxPreview={4}
                                            />
                                          </DialogContent>
                                        </Dialog>
                                      )}
                                    </div>
                                  </TableCell>

                                  <TableCell>
                                    <div className="text-sm">
                                      {new Date(
                                        submission.submittedAt
                                      ).toLocaleString()}
                                    </div>
                                  </TableCell>

                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleSubmissionAction(
                                            submission._id,
                                            "approve"
                                          )
                                        }
                                        className="bg-primary hover:bg-primary/80"
                                      >
                                        <Check className="h-3 w-3 mr-1" />
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          handleSubmissionAction(
                                            submission._id,
                                            "reject"
                                          )
                                        }
                                      >
                                        <X className="h-3 w-3 mr-1" />
                                        Reject
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleDeleted(submission._id)
                                        }
                                        className="bg-primary hover:bg-primary/80"
                                      >
                                        <Trash className="h-3 w-3 mr-1" />
                                        Deleted
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-primary"
                                        >
                                          <Eye className="h-4 w-4 mr-1" />
                                          View Reject
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Reject Details
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-3">
                                          <p className=" text-sm text-red-600">
                                            {submission.rejectReason}
                                          </p>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No submissions yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
      {filteredData.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              No jobs found matching your search.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyJobs;
