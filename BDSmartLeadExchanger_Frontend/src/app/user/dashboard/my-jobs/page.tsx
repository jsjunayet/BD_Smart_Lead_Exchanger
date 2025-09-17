"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Clock, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface JobSubmission {
  id: string;
  user: string;
  authorName: string;
  submissionName: string;
  proofScreenshots: string[];
  status: "submitted" | "approved" | "rejected";
  submittedAt: string; // date string
}

interface SubmissionReviewProps {
  jobId: string;
  jobTitle: string;
}

// helper to format seconds to "hh:mm:ss"
const formatTime = (seconds: number) => {
  if (seconds <= 0) return "Auto Approved";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? `${h}h ` : ""}${m}m ${s}s`;
};

const SubmissionReview = ({ jobId, jobTitle }: SubmissionReviewProps) => {
  const [submissions, setSubmissions] = useState<JobSubmission[]>([
    {
      id: "SUB001",
      user: "user123",
      authorName: "Alice Johnson",
      submissionName: "Marketing Campaign Complete",
      proofScreenshots: ["/placeholder.svg", "/placeholder.svg"],
      status: "submitted",
      submittedAt: new Date(Date.now() - 37 * 60 * 1000).toISOString(), // 37 min ago
    },
    {
      id: "SUB002",
      user: "user456",
      authorName: "Bob Smith",
      submissionName: "Campaign Results Analysis",
      proofScreenshots: ["/placeholder.svg", "/placeholder.svg"],
      status: "approved",
      submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hrs ago
    },
    {
      id: "SUB003",
      user: "user789",
      authorName: "Carol Brown",
      submissionName: "Social Media Posts",
      proofScreenshots: ["/placeholder.svg"],
      status: "submitted",
      submittedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 1.5 hrs ago
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] =
    useState<JobSubmission | null>(null);

  // countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSubmissions((prevSubs) =>
        prevSubs.map((sub) => {
          if (sub.status !== "submitted") return sub;

          const submittedTime = new Date(sub.submittedAt).getTime();
          const deadline = submittedTime + 2 * 60 * 60 * 1000; // 2 hours
          const remaining = Math.floor((deadline - Date.now()) / 1000);

          if (remaining <= 0) {
            // auto approve after 2 hrs
            toast.success(`Submission ${sub.id} auto-approved!`);
            return { ...sub, status: "approved" };
          }

          return sub;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "submitted":
        return <Badge className="bg-blue-500">Submitted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSubmissionAction = (
    submissionId: string,
    action: "approve" | "reject"
  ) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, status: action } : sub
      )
    );
    toast.success(`Submission ${action}d successfully`);
    setSelectedSubmission(null);
  };

  // counts
  const pendingCount = submissions.filter(
    (s) => s.status === "submitted"
  ).length;
  const approvedCount = submissions.filter(
    (s) => s.status === "approved"
  ).length;
  const rejectedCount = submissions.filter(
    (s) => s.status === "rejected"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Submission Review</h2>
          <p className="text-muted-foreground">{jobTitle}</p>
        </div>
        <Badge variant="outline">Job Owner</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Submissions ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Submission</TableHead>
                <TableHead>Screenshots</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time Remaining</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => {
                const submittedTime = new Date(
                  submission.submittedAt
                ).getTime();
                const deadline = submittedTime + 2 * 60 * 60 * 1000;
                const remaining = Math.floor((deadline - Date.now()) / 1000);

                return (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.id}</TableCell>
                    <TableCell>{submission.authorName}</TableCell>
                    <TableCell>{submission.submissionName}</TableCell>
                    <TableCell>
                      {submission.proofScreenshots.length} files
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      {submission.status === "submitted" ? (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatTime(remaining)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Completed
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.status === "submitted" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() =>
                              handleSubmissionAction(submission.id, "approve")
                            }
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleSubmissionAction(submission.id, "reject")
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionReview;
