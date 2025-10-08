"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ScreenshotViewer } from "@/components/ui/screenshot-viewer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getOwnSubmission } from "@/services/JobSubmission";
import {
  createReportService,
  OwnReportService,
} from "@/services/reportService";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Job {
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
}

interface User {
  _id: string;
  name: string;
  userName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  affiliateNetworkName: string;
  publisherId: string;
  role: string;
  image: string;
  surfingBalance: number;
  wallet: number;
  isApproved: boolean;
  status: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkHistoryItem {
  _id: string;
  job: Job;
  user: User;
  proofScreenshots: string[];
  status: "submitted" | "approved" | "rejected";
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const WorkHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [Submission, setSubmission] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setisloading] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const itemsPerPage = 5;
  const [userReports, setUserReports] = useState<{ [key: string]: any }>({});

  const getStatusBadge = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "submitted":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredData = Submission?.filter(
    (item: any) =>
      item.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math?.ceil(filteredData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData?.slice(startIndex, endIndex);
  console.log(currentData, "couree");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleReport = async (id: string) => {
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for the report");
      return;
    }
    const payload = { submission: id, reason: reportReason };
    setisloading(true);
    const res = await createReportService(payload);
    if (res.success) {
      setisloading(false);
      toast.success("Report submitted successfully. Admin will review it.");
      setReportReason("");
      setSelectedItem(null);
      setUserReports((prev) => ({
        ...prev,
        [id]: res.data,
      }));
    } else {
      setisloading(false);

      toast.error(`${res.message}`);
    }
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchJobs(); // ✅ Call the function
  }, []);
  const fetchJobs = async () => {
    try {
      const res = await getOwnSubmission();
      console.log(res);
      setSubmission(res?.data);
    } catch (error) {
      console.error("Error fetching workplace jobs");
    }
  };
  useEffect(() => {
    const fetchReports = async () => {
      if (Submission) {
        for (const sub of Submission) {
          const res = await OwnReportService(sub._id);
          if (res.success) {
            setUserReports((prev) => ({
              ...prev,
              [sub._id]: res.data,
            }));
          }
        }
      }
    };
    fetchReports();
  }, [Submission]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="md:flex  items-center justify-between">
            <span className=" mb-2 md:mb-0">Work History</span>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Details</TableHead>
                  <TableHead>Job Post Creator Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Proof Screenshots</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData?.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{item.job.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.job.description}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <span>ID: {item.job._id.slice(-8)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.job.postedBy.ProfileImage} />
                          <AvatarFallback>
                            {item.job.postedBy.name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {item.job.postedBy.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.job.postedBy.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {item.proofScreenshots.length} files
                        </span>
                        {item.proofScreenshots.length > 0 && (
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
                                screenshots={item.proofScreenshots}
                                titles={item.job.screenshotTitles}
                                professionalName={item.user.name}
                                professionalImage={item.user.image}
                                maxPreview={4}
                              />
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {new Date(item.submittedAt).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(item.submittedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl  h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            <DialogHeader>
                              <DialogTitle>Submission Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid  grid-cols-1 gap-6">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">
                                      Job Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div>
                                      <span className="font-medium">
                                        Title:
                                      </span>
                                      <p className="text-muted-foreground">
                                        {item.job.title}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Description:
                                      </span>
                                      <p className="text-muted-foreground">
                                        {item.job.description}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Job URL:
                                      </span>
                                      <p className="text-muted-foreground break-all">
                                        {item.job.jobUrl}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Screenshot Requirements:
                                      </span>
                                      <ul className="text-muted-foreground list-disc list-inside">
                                        {item.job.screenshotTitles.map(
                                          (title: any, index: any) => (
                                            <li key={index}>{title}</li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">
                                      Submission Details
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div>
                                      <span className="font-medium">
                                        Submission Email:
                                      </span>
                                      <p className="text-muted-foreground font-mono">
                                        {item.user.email}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Status:
                                      </span>
                                      <div className="mt-1">
                                        {getStatusBadge(item.status)}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Submitted At:
                                      </span>
                                      <p className="text-muted-foreground">
                                        {new Date(
                                          item.submittedAt
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Proof Files:
                                      </span>
                                      <p className="text-muted-foreground">
                                        {item.proofScreenshots.length}{" "}
                                        screenshots uploaded
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {item.proofScreenshots.length > 0 && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">
                                      Professional Screenshots
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <ScreenshotViewer
                                      screenshots={item.proofScreenshots}
                                      titles={item.job.screenshotTitles}
                                      professionalName={item.user.name}
                                      professionalImage={item.user.image}
                                      maxPreview={6}
                                    />
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {/* 
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Submission</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <span className="font-medium">Job:</span>
                                <p className="text-muted-foreground">
                                  {item.job.title}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium">
                                  Submission ID:
                                </span>
                                <p className="text-muted-foreground font-mono">
                                  {item._id}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium">
                                  Current Status:
                                </span>
                                <div className="mt-1">
                                  {getStatusBadge(item.status)}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Update Proof Screenshots
                                </label>
                                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                                  <p className="text-muted-foreground">
                                    Click to upload new screenshots
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Current files:{" "}
                                    {item.proofScreenshots.length}
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={() =>
                                  toast.success(
                                    "Submission updated successfully"
                                  )
                                }
                                className="w-full"
                              >
                                Update Submission
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog> */}

                        {item.status === "rejected" && (
                          <>
                            {userReports[item._id] ? (
                              // ✅ Report already exists
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-primary"
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Report
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Report Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-3">
                                    <p>
                                      <strong>Submission ID:</strong> {item._id}
                                    </p>
                                    <p>
                                      <strong>Reason:</strong>{" "}
                                      {userReports[item._id].reason}
                                    </p>
                                    <p>
                                      <strong>Admin Notes:</strong>{" "}
                                      {userReports[item._id].adminNotes}
                                    </p>
                                    <p>
                                      <strong>Status:</strong>{" "}
                                      {userReports[item._id].status}
                                    </p>
                                    <p>
                                      <strong>Reported At:</strong>{" "}
                                      {new Date(
                                        userReports[item._id].createdAt
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              // ✅ Report button if not reported yet
                              <Dialog
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setDialogOpen(true);
                                    }}
                                  >
                                    <Flag className="h-4 w-4 mr-1" />
                                    Report
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Report Submission Issue
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Textarea
                                      placeholder="Describe the issue..."
                                      value={reportReason}
                                      onChange={(e) =>
                                        setReportReason(e.target.value)
                                      }
                                      rows={4}
                                    />
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => setDialogOpen(false)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => handleReport(item._id)}
                                      >
                                        {isLoading ? (
                                          <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Submitting...
                                          </>
                                        ) : (
                                          "Submit Report"
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredData.length)} of{" "}
                {filteredData.length} entries
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Show pagination info like in the image */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1 to {Math.min(itemsPerPage, filteredData?.length)} of{" "}
              {filteredData?.length} entries
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
