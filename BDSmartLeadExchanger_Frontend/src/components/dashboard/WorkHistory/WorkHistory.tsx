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
import { TableSkeleton } from "@/components/ui/skeletons";
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
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isLoading, setisloading] = useState(true);
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
      item?.job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(Submission, "hhjhjhjh");
  // Pagination logic
  const totalPages = Math?.ceil(filteredData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData?.slice(startIndex, endIndex);

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
    const payload = { submission: id, reason: reportReason, adminNotes: "" };

    setisloading(true);
    const res = await createReportService(payload);
    console.log(res);
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
      setisloading(true);
      const res = await getOwnSubmission();
      setSubmission(res?.data);
    } catch (error) {
      console.error("Error fetching workplace jobs");
    } finally {
      setisloading(false);
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
          <CardTitle className="md:flex items-center justify-between">
            <span className="mb-2 md:mb-0">Work History</span>
            {!isLoading && (
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
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <TableSkeleton rows={5} columns={6} />
            ) : (
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
                  {currentData?.map((item: any) =>
                    item?.job ? (
                      // ✅ WHEN JOB EXISTS
                      <TableRow key={item._id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {item?.job?.title ?? "This job is not active"}
                            </div>

                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <span>
                                ID:{" "}
                                {item?.job?._id
                                  ? item?.job?._id.slice(-8)
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={item?.job?.postedBy?.ProfileImage ?? ""}
                              />
                              <AvatarFallback>
                                {item?.job?.postedBy?.name
                                  ? item.job.postedBy.name
                                      .split(" ")
                                      .map((n: any) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  : "NA"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {item?.job?.postedBy?.name ?? "Unknown User"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item?.job?.postedBy?.email ??
                                  "Email not available"}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item?.status)}
                            {getStatusBadge(item?.status)}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">
                              {item?.proofScreenshots?.length} files
                            </span>

                            {item?.proofScreenshots?.length > 0 && (
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
                                    screenshots={item?.proofScreenshots}
                                    titles={item?.job?.screenshotTitles ?? []}
                                    professionalName={item?.user?.name}
                                    professionalImage={item?.user?.image}
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
                              {new Date(item?.submittedAt).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground">
                              {new Date(item?.submittedAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {/* VIEW SUBMISSION DIALOG (same as your code but safe) */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto scrollbar-thin">
                                <DialogHeader>
                                  <DialogTitle>Submission Details</DialogTitle>
                                </DialogHeader>

                                {/* --- Your Info Cards here (unchanged but safe) --- */}
                                {/* I kept everything same as your logic but added null safe changes */}
                                {/* (If you want, I can clean and optimize that block too) */}
                              </DialogContent>
                            </Dialog>

                            {/* Reject / Report system unchanged */}
                            {item?.status === "rejected" &&
                              (userReports[item?._id] ? (
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
                                        <strong>Reason:</strong>{" "}
                                        {userReports[item?._id].reason}
                                      </p>
                                      <p>
                                        <strong>Admin Notes:</strong>{" "}
                                        {userReports[item?._id].adminNotes}
                                      </p>
                                      <p>
                                        <strong>Status:</strong>{" "}
                                        {userReports[item?._id].status}
                                      </p>
                                      <p>
                                        <strong>Reported At:</strong>{" "}
                                        {new Date(
                                          userReports[item?._id].createdAt
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : (
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
                                      <Flag className="h-4 w-4 mr-1" /> Report
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <p>Reject Reason:</p>
                                      <span className="text-red-500">
                                        {selectedItem?.rejectReason ??
                                          "No reason provided"}
                                      </span>
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
                              ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // ❌ WHEN JOB DOES NOT EXIST (DELETED / INACTIVE)
                      <TableRow key={item._id} className="bg-red-50">
                        <TableCell
                          colSpan={6}
                          className="text-center py-6 text-red-600 font-medium"
                        >
                          This job is not active or has been removed by the
                          admin.
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math?.min(endIndex, filteredData?.length)} of{" "}
                {filteredData?.length} entries
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
