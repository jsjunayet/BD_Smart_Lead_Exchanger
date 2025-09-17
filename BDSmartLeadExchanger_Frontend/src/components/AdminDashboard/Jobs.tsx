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
import { Check, Eye, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  description: string;
  jobUrl: string;
  screenshotTitles: string[];
  thumbnail: string;
  postedBy: string;
  approvedByAdmin: boolean;
  status: "pending" | "approved" | "rejected";
  payment: number;
  createdAt: string;
}

const JobManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const jobsData: Job[] = [
    {
      id: "JOB001",
      title: "Social Media Marketing Campaign",
      description:
        "Create and manage social media posts for our brand awareness campaign",
      jobUrl: "https://example.com/campaign",
      screenshotTitles: [
        "Homepage Screenshot",
        "Campaign Results",
        "Analytics Dashboard",
      ],
      thumbnail: "/placeholder.svg",
      postedBy: "John Doe",
      approvedByAdmin: false,
      status: "pending",
      payment: 50,
      createdAt: "2024-01-15 10:30 AM",
    },
    {
      id: "JOB002",
      title: "Website Testing & Bug Report",
      description: "Test our new website and provide detailed bug reports",
      jobUrl: "https://example.com/testing",
      screenshotTitles: ["Bug Screenshots", "Test Results"],
      thumbnail: "/placeholder.svg",
      postedBy: "Sarah Wilson",
      approvedByAdmin: true,
      status: "approved",
      payment: 75,
      createdAt: "2024-01-15 09:15 AM",
    },
    {
      id: "JOB003",
      title: "Content Writing Project",
      description: "Write engaging blog posts about technology trends",
      jobUrl: "https://example.com/content",
      screenshotTitles: ["Article Draft", "Published Content"],
      thumbnail: "/placeholder.svg",
      postedBy: "Mike Johnson",
      approvedByAdmin: false,
      status: "rejected",
      payment: 100,
      createdAt: "2024-01-14 08:45 PM",
    },
  ];

  const filteredJobs = jobsData.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.postedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
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

  const handleJobAction = (
    jobId: string,
    action: "approve" | "reject" | "delete"
  ) => {
    toast.success(`Job ${action}d successfully`);
    setSelectedJob(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Job Management</h1>
        <Badge variant="outline">Admin Panel</Badge>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, or posted by..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Jobs ({filteredJobs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Posted By</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {job.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{job.postedBy}</TableCell>
                  <TableCell>${job.payment}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>{job.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedJob(job)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Job Details - {job.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Title
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {job.title}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Posted By
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {job.postedBy}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Payment
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  ${job.payment}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Status
                                </label>
                                <div className="mt-1">
                                  {getStatusBadge(job.status)}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium">
                                Description
                              </label>
                              <p className="text-sm text-muted-foreground bg-muted p-3 rounded mt-1">
                                {job.description}
                              </p>
                            </div>

                            <div>
                              <label className="text-sm font-medium">
                                Job URL
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {job.jobUrl}
                              </p>
                            </div>

                            <div>
                              <label className="text-sm font-medium">
                                Screenshot Requirements
                              </label>
                              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                {job.screenshotTitles.map((title, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                    {title}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex space-x-2 pt-4">
                              {job.status === "pending" && (
                                <>
                                  <Button
                                    onClick={() =>
                                      handleJobAction(job.id, "approve")
                                    }
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleJobAction(job.id, "reject")
                                    }
                                    variant="destructive"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button
                                onClick={() =>
                                  handleJobAction(job.id, "delete")
                                }
                                variant="destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
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

export default JobManagement;
