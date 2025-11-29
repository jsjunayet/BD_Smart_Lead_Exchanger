"use client";
import { uploadImageToCloudinary } from "@/components/share/clodinaryUpload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScreenshotViewer } from "@/components/ui/screenshot-viewer";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Textarea } from "@/components/ui/textarea";
import { getOwnjobs, Updatejobs } from "@/services/jobService"; // Import updateJob
import { ApprovedOrRejectSubmission } from "@/services/JobSubmission";
import {
  Briefcase,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Edit,
  ExternalLink,
  Eye,
  ImageIcon,
  Loader2,
  Save,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
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
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<MyJobItem | null>(null);
  const [myJobsData, setMyJobsData] = useState<MyJobItem[]>([]);
  const [submissions, setSubmissions] = useState<{ [key: string]: number }>({});
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSubmissions((prev) => {
        const updated: { [key: string]: number } = {};
        myJobsData.forEach((job) => {
          job.submissions.forEach((sub) => {
            if (sub.status === "submitted") {
              const submittedTime = new Date(sub.submittedAt).getTime();
              const deadline = submittedTime + 5 * 60 * 60 * 1000;
              // const deadline = submittedTime + 6 * 60 * 1000;
              const remaining = Math.floor((deadline - Date.now()) / 1000);

              if (remaining <= 0) {
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
    setIsLoading(true);
    try {
      const response = await getOwnjobs();
      setMyJobsData(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setNewThumbnail(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setNewThumbnail(null);
    setPreviewImage(null);
    // Reset file input
    const fileInput = document.getElementById(
      "thumbnail-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Handle job edit submission
  const handleJobEdit = async () => {
    if (!editingJob) return;

    try {
      setIsLoading(true);

      let thumbnailUrl = editingJob.thumbnail;

      // ✅ If a new image selected → upload to Cloudinary first
      if (newThumbnail) {
        const uploadedUrl = await uploadImageToCloudinary(newThumbnail);
        thumbnailUrl = uploadedUrl;
      }

      // ✅ Prepare updated job data
      const updatedJob = {
        title: editingJob.title,
        description: editingJob.description,
        jobUrl: editingJob.jobUrl,
        screenshotTitles: editingJob.screenshotTitles,
        thumbnail: thumbnailUrl, // keep old or use new
      };
      const response = await Updatejobs(editingJob._id, updatedJob);

      if (response.success) {
        toast.success("Job updated successfully!");
        setEditingJob(null);
        setNewThumbnail(null);
        setPreviewImage(null);
        fetchData(); // Refresh data
        setIsLoading(false);
      } else {
        toast.error(response.message || "Failed to update job");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating job:", error);
      setIsLoading(false);
      toast.error("An error occurred while updating the job");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset edit form when opening dialog
  const handleEditDialogOpen = (job: MyJobItem) => {
    setEditingJob(job);
    setNewThumbnail(null);
    setPreviewImage(null);
  };

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
    action: "approve" | "reject",
    reject: string
  ) => {
    setLoading(true);
    const payload = {
      action,
      rejectReason: action === "reject" ? reject : "", // ✅ only send reject reason if rejecting
    };
    const res = await ApprovedOrRejectSubmission(submissionId, payload);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      setLoading(false);

      fetchData();
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  const handleRejectSubmit = async (submissionId: string) => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a reason for rejection.");
      return;
    }
    console.log(submissionId, rejectReason);
    await handleSubmissionAction(submissionId, "reject", rejectReason);
    setRejectReason("");
    setLoading(false);

    setRejectDialogOpen(false);
  };

  const getSubmissionStats = (submissions: Submission[]) => {
    const total = submissions.length;
    const approved = submissions.filter((s) => s.status === "approved").length;
    const submitted = submissions.filter(
      (s) => s.status === "submitted"
    ).length;
    const rejected = submissions.filter((s) => s.status === "rejected").length;
    return { total, approved, submitted, rejected };
  };

  const filteredData = myJobsData.filter((item) => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-muted rounded-lg">
                    <div className="h-4 w-4" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
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
                        job.submissions.filter((s) => s.status === "submitted")
                          .length,
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
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Posted Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={5} columns={5} />
            </CardContent>
          </Card>
        ) : filteredData.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't posted any jobs yet or none match your search.
              </p>
              <Button>Post a New Job</Button>
            </CardContent>
          </Card>
        ) : (
          filteredData.map((job) => {
            const stats = getSubmissionStats(job.submissions);
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
                      <p className="text-muted-foreground">{job.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="h-3 w-3" />
                          <span className="truncate max-w-[300px]">
                            {job.jobUrl}
                          </span>
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
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingJob(job)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit Job
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                          <DialogHeader>
                            <DialogTitle>Edit Job</DialogTitle>
                          </DialogHeader>
                          {editingJob && (
                            <div className="space-y-4">
                              <div className="space-y-3">
                                <label className="text-sm font-medium">
                                  Job Thumbnail
                                </label>

                                {!previewImage && editingJob.thumbnail && (
                                  <div className="relative group">
                                    <div className="border rounded-lg p-2">
                                      <p className="text-sm text-muted-foreground mb-2">
                                        Current Thumbnail:
                                      </p>
                                      <Image
                                        src={editingJob.thumbnail}
                                        alt={editingJob.title}
                                        width={200}
                                        height={120}
                                        className="rounded-md object-cover"
                                      />
                                    </div>
                                  </div>
                                )}

                                {previewImage && (
                                  <div className="relative group">
                                    <div className="border rounded-lg p-2">
                                      <p className="text-sm text-muted-foreground mb-2">
                                        New Thumbnail Preview:
                                      </p>
                                      <Image
                                        src={previewImage}
                                        alt="Preview"
                                        width={200}
                                        height={120}
                                        className="rounded-md object-cover"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-3 right-3"
                                        onClick={handleRemoveImage}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-3">
                                  <Input
                                    id="thumbnail-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      document
                                        .getElementById("thumbnail-upload")
                                        ?.click()
                                    }
                                  >
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    {editingJob.thumbnail
                                      ? "Change Thumbnail"
                                      : "Upload Thumbnail"}
                                  </Button>
                                  {previewImage && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={handleRemoveImage}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove
                                    </Button>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Recommended: Square image (500x500px), max 5MB
                                </p>
                              </div>

                              <div>
                                <label className="text-sm font-medium">
                                  Job Title
                                </label>
                                <Input
                                  defaultValue={editingJob.title}
                                  onChange={(e) =>
                                    setEditingJob({
                                      ...editingJob,
                                      title: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium">
                                  Description
                                </label>
                                <Textarea
                                  defaultValue={editingJob.description}
                                  onChange={(e) =>
                                    setEditingJob({
                                      ...editingJob,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium">
                                  Job URL
                                </label>
                                <Input
                                  defaultValue={editingJob.jobUrl}
                                  onChange={(e) =>
                                    setEditingJob({
                                      ...editingJob,
                                      jobUrl: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium">
                                  Screenshot Requirements
                                </label>
                                <Textarea
                                  defaultValue={editingJob.screenshotTitles.join(
                                    "\n"
                                  )}
                                  placeholder="Enter each requirement on a new line"
                                  onChange={(e) =>
                                    setEditingJob({
                                      ...editingJob,
                                      screenshotTitles: e.target.value
                                        .split("\n")
                                        .filter((t) => t.trim()),
                                    })
                                  }
                                />
                              </div>

                              <Button
                                disabled={isLoading}
                                onClick={() => handleJobEdit()}
                                className="w-full"
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2" />
                                    Save Changing...
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
                      <h4 className="font-medium mb-4">
                        Submissions ({stats.total})
                      </h4>

                      {job.submissions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Submission Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Remaining Time</TableHead>
                                <TableHead>Proof Screenshots</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {job.submissions.map((submission: any) => (
                                <TableRow key={submission._id}>
                                  <TableCell className="font-mono text-sm">
                                    {submission?.user?.email}
                                    <p className=" text-sm text-gray-700">
                                      {submission?.user?.name}
                                    </p>
                                  </TableCell>
                                  <TableCell>
                                    {getSubmissionStatusBadge(
                                      submission.status
                                    )}
                                  </TableCell>

                                  <TableCell className="text-sm">
                                    {/* {submission.status === "submitted"
                                      ? submissions[submission._id] !==
                                        undefined
                                        ? formatCountdown(
                                            submissions[submission._id]
                                          )
                                        : "Auto Approved"
                                      : "--"} */}
                                    "Auto Approve Off"
                                  </TableCell>

                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm">
                                        {submission.proofScreenshots.length}{" "}
                                        files
                                      </span>
                                      {submission.proofScreenshots.length >
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
                                                submission.proofScreenshots
                                              }
                                              titles={job.screenshotTitles}
                                              professionalName={`${submission?.user?.email}`}
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
                                    {submission.status === "submitted" ? (
                                      <div className="flex space-x-2">
                                        {/* ✅ Approve Button */}
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleSubmissionAction(
                                              submission._id,
                                              "approve",
                                              ""
                                            )
                                          }
                                          className="bg-primary hover:bg-primary/80"
                                          disabled={loading}
                                        >
                                          {loading ? (
                                            <>
                                              <Loader2 className="animate-spin h-3 w-3 mr-1" />
                                              Approving...
                                            </>
                                          ) : (
                                            <>
                                              <Check className="h-3 w-3 mr-1" />
                                              Approve
                                            </>
                                          )}
                                        </Button>

                                        {/* ❌ Reject Button — Opens Modal */}
                                        <Dialog
                                          open={rejectDialogOpen}
                                          onOpenChange={setRejectDialogOpen}
                                        >
                                          <DialogTrigger asChild>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                            >
                                              {loading ? (
                                                <>
                                                  <Loader2 className="animate-spin h-3 w-3 mr-1" />
                                                  Rejecting...
                                                </>
                                              ) : (
                                                <>
                                                  <X className="h-3 w-3 mr-1" />
                                                  Reject
                                                </>
                                              )}
                                            </Button>
                                          </DialogTrigger>

                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Reject Submission
                                              </DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-3">
                                              <p>
                                                Please provide a reason for
                                                rejecting this submission:
                                              </p>
                                              <Input
                                                placeholder="Enter reason..."
                                                value={rejectReason}
                                                onChange={(e) =>
                                                  setRejectReason(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <DialogFooter>
                                              <Button
                                                variant="outline"
                                                onClick={() =>
                                                  setRejectDialogOpen(false)
                                                }
                                              >
                                                Cancel
                                              </Button>
                                              <Button
                                                variant="destructive"
                                                onClick={() =>
                                                  handleRejectSubmit(
                                                    submission._id
                                                  )
                                                }
                                                disabled={loading}
                                              >
                                                {loading ? (
                                                  <>
                                                    <Loader2 className="animate-spin h-4 w-4 mr-1" />
                                                    Submitting...
                                                  </>
                                                ) : (
                                                  "Submit"
                                                )}
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    ) : (
                                      <span className="text-sm text-muted-foreground">
                                        {submission.status === "approved" ? (
                                          "Approved"
                                        ) : (
                                          <>
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
                                                <div className="">
                                                  <p className=" text-sm text-red-600">
                                                    {submission?.rejectReason && (
                                                      <span className="block text-xs text-destructive mt-1">
                                                        Reason:{" "}
                                                        {
                                                          submission?.rejectReason
                                                        }
                                                      </span>
                                                    )}
                                                  </p>
                                                </div>
                                              </DialogContent>
                                            </Dialog>
                                          </>
                                        )}
                                      </span>
                                    )}
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
          })
        )}
      </div>

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
