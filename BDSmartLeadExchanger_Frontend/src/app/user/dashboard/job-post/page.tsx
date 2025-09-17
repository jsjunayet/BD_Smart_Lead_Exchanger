"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createjobs } from "@/services/jobService";
import { AlertCircle, CheckCircle, Clock, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const JobPost = () => {
  const [loading, setloading] = useState(false);
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
    thumbnail: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobPayload = {
      title: jobData.title,
      description: jobData.tasks,
      jobUrl: jobData.jobUrl,
      screenshotTitles: [
        jobData.screenshot1Title,
        jobData.screenshot2Title,
        jobData.screenshot3Title,
        jobData.screenshot4Title,
      ].filter(Boolean),
    };

    const formData = new FormData();
    if (jobData.thumbnail) {
      formData.append("file", jobData.thumbnail);
    }
    formData.append("data", JSON.stringify(jobPayload));
    try {
      setloading(true);
      const res = await createjobs(formData);
      console.log(res);
      if (res?.success) {
        toast.success(res.message);
        setloading(false);
        setJobData({});
      } else {
        res.errorSources.forEach((err: any) => {
          toast(err.message); // or use a custom toast component
        });
        setloading(false);
      }
    } catch (error) {
      setloading(false);
      toast(error.response?.data?.message || "Job Create failed!");
    }
  };
  const handleInputChange = (field: string, value: string | File | null) => {
    setJobData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Post a Job
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new job posting for the community
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          <Clock className="w-3 h-3 mr-1" />
          Payment Required
        </Badge>
      </div>

      {/* Payment Notice */}
      <Card className="border-warning/20 bg-warning/5">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-warning">Payment Required</h3>
              <p className="text-sm text-muted-foreground">
                You need to make a payment before posting a job. Each user can
                only post one job at a time. If you make a mistake, you can edit
                your job after posting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5" />
                <span>Job Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Write an accurate job title *</Label>
                  <Input
                    id="title"
                    placeholder="Write Job title"
                    value={jobData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tasks">
                    What specific tasks need to be completed *
                  </Label>
                  <Textarea
                    id="tasks"
                    placeholder="What specific tasks need to be completed"
                    value={jobData.tasks}
                    onChange={(e) => handleInputChange("tasks", e.target.value)}
                    rows={4}
                    className="w-full resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobUrl">Job Url</Label>
                  <Input
                    id="jobUrl"
                    placeholder="Job Url"
                    value={jobData.jobUrl}
                    onChange={(e) =>
                      handleInputChange("jobUrl", e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot1Title">Screenshot 1 Title</Label>
                  <Input
                    id="screenshot1Title"
                    placeholder="Screenshot 1 Title"
                    value={jobData.screenshot1Title}
                    onChange={(e) =>
                      handleInputChange("screenshot1Title", e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot2Title">Screenshot 2 Title</Label>
                  <Input
                    id="screenshot2Title"
                    placeholder="Screenshot 2 Title"
                    value={jobData.screenshot2Title}
                    onChange={(e) =>
                      handleInputChange("screenshot2Title", e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot3Title">Screenshot 3 Title</Label>
                  <Input
                    id="screenshot3Title"
                    placeholder="Screenshot 3 Title"
                    value={jobData.screenshot3Title}
                    onChange={(e) =>
                      handleInputChange("screenshot3Title", e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot4Title">Screenshot 4 Title</Label>
                  <Input
                    id="screenshot4Title"
                    placeholder="Screenshot 4 Title"
                    value={jobData.screenshot4Title}
                    onChange={(e) =>
                      handleInputChange("screenshot4Title", e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleInputChange(
                        "thumbnail",
                        e.target.files?.[0] || null
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div className="flex justify-center pt-4 w-full">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-8 w-full"
                  >
                    {loading ? " Submit..." : " Submit"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posting Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Write clear and detailed job descriptions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Set realistic payment amounts</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Provide step-by-step instructions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>Admin approval required before going live</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Your Posted Jobs
                  </span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Active Jobs
                  </span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Completed Jobs
                  </span>
                  <Badge className="bg-success">0</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobPost;
