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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Check, Eye, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Report {
  id: string;
  user: string;
  submission: string;
  submissionName: string;
  jobTitle: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
  adminResponse?: string;
}

const ReportManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminResponse, setAdminResponse] = useState("");

  const reportsData: Report[] = [
    {
      id: "RPT001",
      user: "Alice Johnson",
      submission: "SUB001",
      submissionName: "Marketing Campaign Complete",
      jobTitle: "Social Media Marketing Campaign",
      reason:
        "Submission was unfairly rejected. I completed all requirements but got rejected without proper explanation.",
      status: "pending",
      createdAt: "2024-01-15 02:30 PM",
    },
    {
      id: "RPT002",
      user: "Bob Smith",
      submission: "SUB005",
      submissionName: "Website Design Mockup",
      jobTitle: "UI/UX Design Project",
      reason:
        "Job poster changed requirements after submission and then rejected my work.",
      status: "resolved",
      createdAt: "2024-01-14 11:15 AM",
      adminResponse:
        "After reviewing both submissions and communications, we found the requirements were clear from the beginning. However, we've provided additional feedback to help improve future submissions.",
    },
    {
      id: "RPT003",
      user: "Carol Brown",
      submission: "SUB008",
      submissionName: "Content Writing Sample",
      jobTitle: "Blog Article Writing",
      reason:
        "Payment was not released even after approval. It's been 3 days since approval.",
      status: "rejected",
      createdAt: "2024-01-13 09:45 AM",
      adminResponse:
        "Payment was processed correctly. The delay was due to banking processing time, which is mentioned in our terms.",
    },
  ];

  const filteredReports = reportsData.filter(
    (report) =>
      report.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Resolved</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      case "pending":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">Pending</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (reason: string) => {
    const lowKeywords = ["question", "clarification", "help"];
    const highKeywords = ["unfair", "scam", "fraud", "payment", "money"];

    const lowerReason = reason.toLowerCase();
    const hasHighPriority = highKeywords.some((keyword) =>
      lowerReason.includes(keyword)
    );
    const hasLowPriority = lowKeywords.some((keyword) =>
      lowerReason.includes(keyword)
    );

    if (hasHighPriority) {
      return <Badge variant="destructive">High Priority</Badge>;
    } else if (hasLowPriority) {
      return <Badge variant="outline">Low Priority</Badge>;
    }
    return <Badge variant="secondary">Medium Priority</Badge>;
  };

  const handleReportAction = (
    reportId: string,
    action: "resolve" | "reject"
  ) => {
    toast.success(`Report ${action}d successfully`);
    setAdminResponse("");
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Report Management</h1>
        <Badge variant="outline">Admin Panel</Badge>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, job title, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.user}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        Sub: {report.submission}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <AlertTriangle className="h-5 w-5 text-orange-500" />
                              <span>Report Details - {report.id}</span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Reported By
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {report.user}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Job Title
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {report.jobTitle}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Status
                                </label>
                                <div className="mt-1">
                                  {getStatusBadge(report.status)}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Submission ID
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {report.submission}
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium">
                                Submission Name
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {report.submissionName}
                              </p>
                            </div>

                            <div>
                              <label className="text-sm font-medium">
                                Report Reason
                              </label>
                              <div className="bg-muted p-4 rounded-lg mt-1">
                                <p className="text-sm">{report.reason}</p>
                              </div>
                            </div>

                            {report.adminResponse && (
                              <div>
                                <label className="text-sm font-medium">
                                  Admin Response
                                </label>
                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-1">
                                  <p className="text-sm">
                                    {report.adminResponse}
                                  </p>
                                </div>
                              </div>
                            )}

                            {report.status === "pending" && (
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm font-medium">
                                    Admin Response
                                  </label>
                                  <Textarea
                                    placeholder="Provide your response to this report..."
                                    value={adminResponse}
                                    onChange={(e) =>
                                      setAdminResponse(e.target.value)
                                    }
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() =>
                                      handleReportAction(report.id, "resolve")
                                    }
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Resolve Report
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleReportAction(report.id, "reject")
                                    }
                                    variant="destructive"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject Report
                                  </Button>
                                </div>
                              </div>
                            )}

                            <div className="text-sm text-muted-foreground pt-2 border-t">
                              <p>Report submitted: {report.createdAt}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportManagement;
