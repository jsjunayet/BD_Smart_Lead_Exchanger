"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PageHeaderSkeleton, SearchFilterSkeleton, TableSkeleton } from "@/components/ui/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Eye, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Submission {
  id: string;
  job: string;
  jobTitle: string;
  user: string;
  authorName: string;
  submissionName: string;
  proofScreenshots: string[];
  status: "submitted" | "approved" | "rejected";
  submittedAt: string;
  timeRemaining: string;
}

const SubmissionManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const submissionsData: Submission[] = [
    {
      id: "SUB001",
      job: "JOB001",
      jobTitle: "Social Media Marketing Campaign",
      user: "user123",
      authorName: "Alice Johnson",
      submissionName: "Marketing Campaign Complete",
      proofScreenshots: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
      status: "submitted",
      submittedAt: "2024-01-15 10:30 AM",
      timeRemaining: "1h 23m",
    },
    {
      id: "SUB002",
      job: "JOB002",
      jobTitle: "Website Testing & Bug Report",
      user: "user456",
      authorName: "Bob Smith",
      submissionName: "Bug Testing Results",
      proofScreenshots: ["/placeholder.svg", "/placeholder.svg"],
      status: "approved",
      submittedAt: "2024-01-15 09:15 AM",
      timeRemaining: "Completed",
    },
    {
      id: "SUB003",
      job: "JOB003",
      jobTitle: "Content Writing Project",
      user: "user789",
      authorName: "Carol Brown",
      submissionName: "Tech Blog Articles",
      proofScreenshots: ["/placeholder.svg"],
      status: "rejected",
      submittedAt: "2024-01-14 08:45 PM",
      timeRemaining: "Expired",
    },
  ];

  const filteredSubmissions = submissionsData.filter(
    (submission) =>
      submission.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.submissionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      case "submitted":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Submitted</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSubmissionAction = (
    submissionId: string,
    action: "approve" | "reject"
  ) => {
    toast.success(`Submission ${action}d successfully`);
    setSelectedSubmission(null);
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <PageHeaderSkeleton />
      ) : (
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Submission Management</h1>
          <Badge variant="outline">Admin Panel</Badge>
        </div>
      )}

      {/* Search */}
      {isLoading ? (
        <SearchFilterSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Search Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title, author name, or submission name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Submissions ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} columns={7} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Author Name</TableHead>
                  <TableHead>Submission Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{submission.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        Job ID: {submission.job}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{submission.authorName}</TableCell>
                  <TableCell>{submission.submissionName}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>

                  <TableCell>{submission.submittedAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              Submission Details - {submission.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Job Title
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {submission.jobTitle}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Author
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {submission.authorName}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Status
                                </label>
                                <div className="mt-1">
                                  {getStatusBadge(submission.status)}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium">
                                Submission Name
                              </label>
                              <p className="text-sm text-muted-foreground bg-muted p-3 rounded mt-1">
                                {submission.submissionName}
                              </p>
                            </div>

                            <div>
                              <label className="text-sm font-medium">
                                Proof Screenshots (
                                {submission.proofScreenshots.length})
                              </label>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                {submission.proofScreenshots.map(
                                  (screenshot, index) => (
                                    <div
                                      key={index}
                                      className="border rounded-lg overflow-hidden"
                                    >
                                      <img
                                        src={screenshot}
                                        alt={`Proof ${index + 1}`}
                                        className="w-full h-32 object-cover"
                                      />
                                      <div className="p-2">
                                        <p className="text-xs text-muted-foreground">
                                          Screenshot {index + 1}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Submitted At
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {submission.submittedAt}
                                </p>
                              </div>
                            </div>

                            {submission.status === "submitted" && (
                              <div className="flex space-x-2 pt-4">
                                <Button
                                  onClick={() =>
                                    handleSubmissionAction(
                                      submission.id,
                                      "approve"
                                    )
                                  }
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve Submission
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleSubmissionAction(
                                      submission.id,
                                      "reject"
                                    )
                                  }
                                  variant="destructive"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject Submission
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionManagement;
