import { DataTablePagination } from "@/components/admin/DataTablePagination";
import { SearchInput } from "@/components/admin/SearchInput";
import { StatsCard } from "@/components/admin/StatsCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockSubmissions } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { JobSubmission } from "@/types";
import {
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminSubmissions() {
  const [submissions, setSubmissions] =
    useState<JobSubmission[]>(mockSubmissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Filter and paginate submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesSearch =
        submission.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.user.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || submission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const stats = useMemo(() => {
    const totalSubmissions = submissions.length;
    const approvedSubmissions = submissions.filter(
      (s) => s.status === "approved"
    ).length;
    const pendingSubmissions = submissions.filter(
      (s) => s.status === "submitted"
    ).length;
    const rejectedSubmissions = submissions.filter(
      (s) => s.status === "rejected"
    ).length;

    return {
      totalSubmissions,
      approvedSubmissions,
      pendingSubmissions,
      rejectedSubmissions,
    };
  }, [submissions]);

  const handleApproveSubmission = (submissionId: string) => {
    setSubmissions(
      submissions.map((submission) =>
        submission._id === submissionId
          ? { ...submission, status: "approved" }
          : submission
      )
    );
    toast({
      title: "Submission Approved",
      description: "User submission has been approved and payment processed",
    });
  };

  const handleRejectSubmission = (submissionId: string) => {
    setSubmissions(
      submissions.map((submission) =>
        submission._id === submissionId
          ? { ...submission, status: "rejected" }
          : submission
      )
    );
    toast({
      title: "Submission Rejected",
      description: "User submission has been rejected",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success text-success-foreground">Approved</Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending Review</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Submission Management
        </h1>
        <p className="text-muted-foreground">
          Review and manage job submissions from users.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          icon={Users}
          description="All submissions received"
        />
        <StatsCard
          title="Approved"
          value={stats.approvedSubmissions}
          icon={Check}
          description="Approved submissions"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingSubmissions}
          icon={Clock}
          description="Awaiting review"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejectedSubmissions}
          icon={X}
          description="Rejected submissions"
        />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          placeholder="Search by job title or user name..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Submissions</SelectItem>
              <SelectItem value="submitted">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {paginatedSubmissions.map((submission) => (
          <Card
            key={submission._id}
            className="bg-gradient-card shadow-card border-0"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {submission.job.title}
                    </h3>
                    {getStatusBadge(submission.status)}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={submission.user.image}
                          alt={submission.user.name}
                        />
                        <AvatarFallback>
                          {submission.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {submission.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{submission.user.userName}
                        </p>
                      </div>
                    </div>

                    <div className="h-4 w-px bg-border"></div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Submitted {formatDate(submission.submittedAt)}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {submission.job.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review Submission
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>
                            Review Submission: {submission.job.title}
                          </DialogTitle>
                          <DialogDescription>
                            Submitted by {submission.user.name} on{" "}
                            {formatDate(submission.submittedAt)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Job Description
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {submission.job.description}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-4">
                              Proof Screenshots (
                              {submission.proofScreenshots.length})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {submission.proofScreenshots.map(
                                (screenshot, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={screenshot}
                                      alt={`Screenshot ${index + 1}`}
                                      className="w-full h-32 object-cover rounded-lg border"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                      {index + 1}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                              Status: {getStatusBadge(submission.status)}
                            </div>
                            {submission.status === "submitted" && (
                              <div className="flex gap-2">
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleRejectSubmission(submission._id)
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  className="bg-success hover:bg-success/90 text-success-foreground"
                                  onClick={() =>
                                    handleApproveSubmission(submission._id)
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {submission.status === "submitted" && (
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => handleApproveSubmission(submission._id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRejectSubmission(submission._id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {filteredSubmissions.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredSubmissions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
}
