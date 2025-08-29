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
import { mockReports } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Report } from "@/types";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Eye,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Filter and paginate reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.submission.job.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const stats = useMemo(() => {
    const totalReports = reports.length;
    const resolvedReports = reports.filter(
      (r) => r.status === "resolved"
    ).length;
    const pendingReports = reports.filter((r) => r.status === "pending").length;
    const rejectedReports = reports.filter(
      (r) => r.status === "rejected"
    ).length;

    return { totalReports, resolvedReports, pendingReports, rejectedReports };
  }, [reports]);

  const handleResolveReport = (reportId: string) => {
    setReports(
      reports.map((report) =>
        report._id === reportId ? { ...report, status: "resolved" } : report
      )
    );
    toast({
      title: "Report Resolved",
      description: "Report has been marked as resolved",
    });
  };

  const handleRejectReport = (reportId: string) => {
    setReports(
      reports.map((report) =>
        report._id === reportId ? { ...report, status: "rejected" } : report
      )
    );
    toast({
      title: "Report Rejected",
      description: "Report has been rejected",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge className="bg-success text-success-foreground">Resolved</Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
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
          Report Management
        </h1>
        <p className="text-muted-foreground">
          Review and handle user reports and issues.
        </p>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <Card
            key={report._id}
            className="bg-gradient-card shadow-card border-0"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      <h3 className="text-lg font-semibold text-foreground">
                        User Report
                      </h3>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Report Reason:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {report.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={report.user.image}
                          alt={report.user.name}
                        />
                        <AvatarFallback>
                          {report.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {report.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reporter
                        </p>
                      </div>
                    </div>

                    <div className="h-4 w-px bg-border"></div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(report.createdAt)}
                    </div>
                  </div>

                  <div className="bg-accent/50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Reported Submission:
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={report.submission.user.image}
                          alt={report.submission.user.name}
                        />
                        <AvatarFallback>
                          {report.submission.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {report.submission.job.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          By {report.submission.user.name} •{" "}
                          {formatDate(report.submission.submittedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Report Details</DialogTitle>
                          <DialogDescription>
                            Submitted by {report.user.name} on{" "}
                            {formatDate(report.createdAt)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Report Reason
                            </h4>
                            <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                              {report.reason}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-3">
                              Reported Submission
                            </h4>
                            <div className="border rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={report.submission.user.image}
                                    alt={report.submission.user.name}
                                  />
                                  <AvatarFallback>
                                    {report.submission.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h5 className="font-medium text-foreground">
                                    {report.submission.job.title}
                                  </h5>
                                  <p className="text-sm text-muted-foreground">
                                    Submitted by {report.submission.user.name}{" "}
                                    on{" "}
                                    {formatDate(report.submission.submittedAt)}
                                  </p>
                                </div>
                              </div>

                              <div className="mb-3">
                                <p className="text-sm text-muted-foreground">
                                  {report.submission.job.description}
                                </p>
                              </div>

                              <div>
                                <h6 className="text-sm font-medium text-foreground mb-2">
                                  Proof Screenshots (
                                  {report.submission.proofScreenshots.length})
                                </h6>
                                <div className="grid grid-cols-3 gap-3">
                                  {report.submission.proofScreenshots.map(
                                    (screenshot, index) => (
                                      <img
                                        key={index}
                                        src={screenshot}
                                        alt={`Screenshot ${index + 1}`}
                                        className="w-full h-24 object-cover rounded border"
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                              Status: {getStatusBadge(report.status)}
                            </div>
                            {report.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  variant="destructive"
                                  onClick={() => handleRejectReport(report._id)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Dismiss Report
                                </Button>
                                <Button
                                  className="bg-success hover:bg-success/90 text-success-foreground"
                                  onClick={() =>
                                    handleResolveReport(report._id)
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Take Action & Resolve
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {report.status === "pending" && (
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => handleResolveReport(report._id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRejectReport(report._id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Dismiss
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
