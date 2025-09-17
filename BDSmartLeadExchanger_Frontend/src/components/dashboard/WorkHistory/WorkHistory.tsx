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
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface WorkHistoryItem {
  id: string;
  jobBy: {
    name: string;
    avatar: string;
  };
  status: "success" | "rejected" | "pending";
  jobTitle: string;
  workTime: string;
  date: string;
}

const workHistoryData: WorkHistoryItem[] = [
  {
    id: "1",
    jobBy: { name: "Dhiraj Roy", avatar: "" },
    status: "pending",
    jobTitle: "সাইনআপ",
    workTime: "05:30 PM",
    date: "11/06/2025",
  },
  {
    id: "2",
    jobBy: { name: "Afran Sabbir", avatar: "" },
    status: "success",
    jobTitle: "সাইন আপ বা অ্যাপ ইনস্টল করুন",
    workTime: "11:08 PM",
    date: "18/01/2025",
  },
  {
    id: "3",
    jobBy: { name: "Hasan", avatar: "" },
    status: "success",
    jobTitle: "Only Signup",
    workTime: "11:04 PM",
    date: "18/01/2025",
  },
  {
    id: "4",
    jobBy: { name: "Nahid uzzaman", avatar: "" },
    status: "rejected",
    jobTitle: "শুধু সাইন আপ করুন",
    workTime: "10:35 PM",
    date: "18/01/2025",
  },
  {
    id: "5",
    jobBy: { name: "Sabuj Ahmed", avatar: "" },
    status: "success",
    jobTitle: "Simple Sign-Up & নিমিত্তেই Approve করা হবে",
    workTime: "10:29 PM",
    date: "18/01/2025",
  },
  {
    id: "6",
    jobBy: { name: "Md Saiful Islam", avatar: "" },
    status: "rejected",
    jobTitle: "🔶 শুধু সাইন আপ করুন 🔶",
    workTime: "10:21 PM",
    date: "18/01/2025",
  },
  {
    id: "7",
    jobBy: { name: "Afran Sabbir", avatar: "" },
    status: "success",
    jobTitle: "সাইন আপ বা অ্যাপ ইনস্টল করুন",
    workTime: "10:10 PM",
    date: "18/01/2025",
  },
  {
    id: "8",
    jobBy: { name: "Noor A Jafrana", avatar: "" },
    status: "success",
    jobTitle: "তেমন কিছুর মাইট্টো মিট্ট আর কিছুর হটে",
    workTime: "10:06 PM",
    date: "18/01/2025",
  },
  {
    id: "9",
    jobBy: { name: "Afran Sabbir", avatar: "" },
    status: "success",
    jobTitle: "সাইন আপ বা অ্যাপ ইনস্টল করুন",
    workTime: "09:53 PM",
    date: "18/01/2025",
  },
];

export const WorkHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<WorkHistoryItem | null>(
    null
  );
  const [reportReason, setReportReason] = useState("");
  const itemsPerPage = 5;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-success text-success-foreground">Success</Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            Rejected
          </Badge>
        );
      case "pending":
        return <Badge className="bg-info text-info-foreground">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-info" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredData = workHistoryData.filter(
    (item) =>
      item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobBy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

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

  const handleReport = () => {
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for the report");
      return;
    }
    toast.success("Report submitted successfully. Admin will review it.");
    setReportReason("");
    setSelectedItem(null);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Work History</span>
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
                  <TableHead>Job By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Work Time</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.jobBy.avatar} />
                          <AvatarFallback>
                            {item.jobBy.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{item.jobBy.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{item.jobTitle}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{item.workTime}</div>
                        <div className="text-muted-foreground">{item.date}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {item.status === "rejected" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                                onClick={() => setSelectedItem(item)}
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
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Job: {item.jobTitle}
                                  </p>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Posted by: {item.jobBy.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Status: Rejected
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Reason for Report
                                  </label>
                                  <Textarea
                                    placeholder="Describe the issue with this rejection (e.g., unfair rejection, requirements not met, etc.)..."
                                    value={reportReason}
                                    onChange={(e) =>
                                      setReportReason(e.target.value)
                                    }
                                    className="mt-1"
                                    rows={4}
                                  />
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedItem(null);
                                      setReportReason("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button onClick={handleReport}>
                                    Submit Report
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
        </CardContent>
      </Card>
    </div>
  );
};
