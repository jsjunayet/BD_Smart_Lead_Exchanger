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
import {
  getAllReportService,
  UpdateReportService,
} from "@/services/reportService";
import { AlertTriangle, Check, Eye, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [reports, setReports] = useState<any[]>([]); // সব reports
  const [openModal, setopenModal] = useState(false);
  const fetchReports = async () => {
    try {
      const res = await getAllReportService();
      console.log(res);
      setReports(res.data);
    } catch (error) {
      console.error("Failed to fetch Reports", error);
    }
  };
  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports?.filter(
    (report) =>
      report.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.submission.job.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
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

  const handleReportAction = async (
    reportId: string,
    action: "resolved" | "rejected"
  ) => {
    const payload = { status: action, adminNotes: adminResponse };
    const res = await UpdateReportService(reportId, payload);
    console.log(res);
    if (res.success) {
      toast.success(`Report ${action}d successfully`);
      setAdminResponse("");
      setSelectedReport(null);
      fetchReports();
    } else {
      toast.error(`${res.message}`);
    }
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
              placeholder="Search by user, email, job title, or reason..."
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
          <CardTitle>All Reports ({filteredReports?.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Report User Name</TableHead>
                <TableHead>Report User Email</TableHead>
                <TableHead>Job CreatorBy Email</TableHead>
                <TableHead>Job CreatorBy Name</TableHead>

                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports?.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report._id}</TableCell>
                  <TableCell>{report.user.name}</TableCell>
                  <TableCell>{report.user.email}</TableCell>
                  <TableCell>{report.submission.job.postedBy.email}</TableCell>
                  <TableCell>{report.submission.job.postedBy.name}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {report.submission.job.title}
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
                              <span>Report Details - {report._id}</span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">
                                Reported By
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {report.user.name}, {report.user.email}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Job Title
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {report.submission.job.title}
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
                                  Job CreatorBy Email
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {report.submission.job.postedBy.email}
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium">
                                Job CreatorBy Name
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {report.submission.job.postedBy.name}
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
                            <div>
                              <label className="text-sm font-medium">
                                Admin Notes
                              </label>
                              <div className="bg-muted p-4 rounded-lg mt-1">
                                <p className="text-sm">{report.adminNotes}</p>
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
                                      handleReportAction(report._id, "resolved")
                                    }
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Resolve Report
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleReportAction(report._id, "rejected")
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
