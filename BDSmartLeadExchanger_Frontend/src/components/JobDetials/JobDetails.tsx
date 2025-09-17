"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { workplaceJobs } from "../dashboard/WorkPlace/WorkplacePage";

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

const SinglePage = ({ jobId }) => {
  const navigate = useRouter();
  const [job, setJob] = useState<WorkplaceJob | null>(null);
  useEffect(() => {
    // Simulate fetching job by ID
    const foundJob = workplaceJobs.find((j) => j.id === jobId);
    setJob(foundJob || null);
  }, [jobId]);
  const [jobData, setJobData] = useState({
    title: "",
    tasks: "",
    jobUrl: "",
    screenshot1Title: "",
    screenshot1File: null as File | null,
    screenshot2Title: "",
    screenshot2File: null as File | null,
    screenshot3Title: "",
    screenshot3File: null as File | null,
    screenshot4Title: "",
    screenshot4File: null as File | null,
    screenshot5File: null as File | null,
    screenshot6File: null as File | null,
    screenshot7File: null as File | null,
    screenshot8File: null as File | null,
    thumbnail: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleInputChange = (field: string, value: string | File | null) => {
    setJobData((prev) => ({ ...prev, [field]: value }));
  };

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

  if (!job) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/workplace")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workplace
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {job.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete this job and submit your work
            </p>
          </div>
        </div>
        {getDifficultyBadge(job.difficulty)}
      </div>

      {/* Job Information Card */}
      <Card className="border-info/20 bg-info/5">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Posted by</p>
                <p className="font-semibold">{job.postedBy}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Rules Section */}
      <Card className="border-info/20 bg-info/5">
        <CardHeader>
          <CardTitle className="text-lg text-info">
            Read the job rules!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">
                What is expected from workers?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                অপনাদি সঠিক ভাবে কাজটি করুন। আমি ও সঠিক ভাবে আপনার কাজটি করবো।
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-success rounded-sm flex-shrink-0 mt-0.5"></div>
                <p className="text-sm">
                  নিচের Copy Url থেকে নিতেজবলি কপি করে অন্য একটি ব্রাউজারে প্রেন
                  করুন।
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-success rounded-sm flex-shrink-0 mt-0.5"></div>
                <p className="text-sm">
                  নিতেজবলি প্রেন হলে আপনাকে একটি TELEGRAM চ্যানেল নিলে খাতো।
                  চোনান টি প্রেন হলে নিস্টার সময় নাগাতে পারে অন্টেতো
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-success rounded-sm flex-shrink-0 mt-0.5"></div>
                <p className="text-sm">
                  TELEGRAM চ্যানেল একটি নিলক পারেন সেখানে ক্লিক করে প্রেন করুন।
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-success rounded-sm flex-shrink-0 mt-0.5"></div>
                <p className="text-sm">
                  নিতেজবলি প্রেন হলে আপনাকে একটি ADS এ নিলে খাতো। সেখানে করেএকটি
                  প্রযাত উভর নিটেন।
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-success rounded-sm flex-shrink-0 mt-0.5"></div>
                <p className="text-sm">
                  এবার আপনাকে SIGN UP অথবা লেটুটে APPS ভাউনলোট করতে হবে। মোটার
                  কাতট কখনটি করুন। ক্রেত নিদেত দেখা দিন।
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Work URL Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Work Url (Copy)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <span className="font-mono text-sm">
                https://t.me/signup135/2
              </span>
              <Button variant="outline" size="sm">
                📋
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Job Completion Form */}
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Remove CardHeader for simpler design */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Main task descriptions */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    ০২। TELEGRAM এর লিংকটি ওপেন করে সাইন সহ ফ্রিয়নট দিন।
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    ০৩। SIGNUP অথবা APPS ডাউনলোড করে চাইম সহ ফ্রিয়নট দিন।
                  </p>
                </div>
              </div>

              {/* File upload sections */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    ০১। TELEGRAM চ্যানেলের চাইম সহ ফ্রিয়নট দিন।
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleInputChange(
                        "screenshot1File",
                        e.target.files?.[0] || null
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    ০২। TELEGRAM এর লিংকটি ওপেন করে সাইন সহ ফ্রিয়নট দিন।
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleInputChange(
                        "screenshot2File",
                        e.target.files?.[0] || null
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    ০৩। SIGNUP অথবা APPS ডাউনলোড করে চাইম সহ ফ্রিয়নট দিন।
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleInputChange(
                        "screenshot3File",
                        e.target.files?.[0] || null
                      )
                    }
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  className="px-12 py-3  bg-primary hover:bg-primary/90"
                >
                  Submit Job
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SinglePage;
