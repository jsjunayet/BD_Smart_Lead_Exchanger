"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    status: "success",
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
];

const WorkHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
        return (
          <Badge className="bg-warning text-warning-foreground">Pending</Badge>
        );
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
        return <Clock className="h-4 w-4 text-warning" />;
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                          >
                            <Flag className="h-4 w-4 mr-1" />
                            Report
                          </Button>
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
export default WorkHistory;
