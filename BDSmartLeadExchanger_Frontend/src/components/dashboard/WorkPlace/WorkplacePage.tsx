"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  AlertTriangle,
  CheckCircle,
  Filter,
  Search,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface WorkplaceJob {
  id: string;
  title: string;
  description: string;
  requirements: string;
  payment: number;
  postedBy: string;
  timeRemaining: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  estimatedTime: string;
}

export const workplaceJobs: WorkplaceJob[] = [
  {
    id: "1",
    title: "সাইনআপ করুন",
    description:
      "একটি নতুন ওয়েবসাইটে সাইনআপ করুন এবং ইমেইল ভেরিফিকেশন সম্পন্ন করুন।",
    requirements: "Valid email address, Phone number verification required",
    payment: 0.5,
    postedBy: "Dhiraj Roy",
    timeRemaining: "23h 45m",
    difficulty: "easy",
    category: "Sign Up",
    estimatedTime: "5 minutes",
  },
  {
    id: "2",
    title: "অ্যাপ ইনস্টল ও রিভিউ",
    description:
      "Play Store থেকে একটি অ্যাপ ইনস্টল করুন এবং ৫ স্টার রিভিউ দিন।",
    requirements: "Android device, Google Play Store access",
    payment: 0.75,
    postedBy: "Afran Sabbir",
    timeRemaining: "12h 20m",
    difficulty: "easy",
    category: "App Install",
    estimatedTime: "10 minutes",
  },
  {
    id: "3",
    title: "সোশ্যাল মিডিয়া ফলো",
    description:
      "Facebook, Instagram, এবং YouTube চ্যানেল ফলো করুন এবং স্ক্রিনশট জমা দিন।",
    requirements: "Active social media accounts",
    payment: 1.0,
    postedBy: "Hasan Ahmed",
    timeRemaining: "6h 15m",
    difficulty: "medium",
    category: "Social Media",
    estimatedTime: "15 minutes",
  },
];

const Workplace = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<WorkplaceJob | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredJobs = workplaceJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      job.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return (
          <Badge className="bg-success text-success-foreground">Easy</Badge>
        );
      case "medium":
        return (
          <Badge className="bg-warning text-warning-foreground">Medium</Badge>
        );
      case "hard":
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            Hard
          </Badge>
        );
      default:
        return <Badge variant="secondary">{difficulty}</Badge>;
    }
  };

  const handleJobClick = (job: WorkplaceJob) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const handleAcceptJob = () => {
    if (selectedJob) {
      router.push(`/user/dashboard/workplace/${selectedJob.id}`, {
        state: { job: selectedJob },
      });
    }
    setIsDialogOpen(false);
  };

  const handleRejectJob = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Workplace
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and complete available jobs from the community
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            <Users className="w-3 h-3 mr-1" />
            {filteredJobs.length} Available
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                className="px-3 py-2 border border-input rounded-md bg-background"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="sign">Sign Up</option>
                <option value="app">App Install</option>
                <option value="social">Social Media</option>
                <option value="data">Data Entry</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Available Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Post By</th>
                  <th className="text-left py-3 px-4">Job Title</th>
                  <th className="text-left py-3 px-4">Job Post Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleJobClick(job)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {job.postedBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{job.postedBy}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-primary hover:underline cursor-pointer">
                        {job.title}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {job.timeRemaining}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
            <p className="text-muted-foreground">
              No jobs match your current search criteria. Try adjusting your
              filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Job Details Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedJob?.title}</span>
              {selectedJob && getDifficultyBadge(selectedJob.difficulty)}
            </DialogTitle>
            <DialogDescription>
              Posted by {selectedJob?.postedBy} • {selectedJob?.timeRemaining}{" "}
              remaining
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleRejectJob}
              className="flex-1"
            >
              No, Cancel
            </Button>
            <Button onClick={handleAcceptJob} className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Yes, Start Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workplace;
