"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getWorkPlace } from "@/services/jobService";
import { createSubmission } from "@/services/JobSubmission";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const [job, setJob] = useState<WorkplaceJob | null>(null);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getWorkPlace();
        const foundJob = res?.data?.find((j) => j?._id === jobId);
        setJob(foundJob || null);
      } catch (error) {
        console.error("Error fetching workplace jobs:", error.message);
      }
    };
    fetchJobs();
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobId) {
      toast.error("Invalid job id");
      return;
    }

    const formData = new FormData();

    // Status JSON payload
    const payload = { status: "submitted" };
    formData.append("data", JSON.stringify(payload));

    // ১️⃣ Screenshots (max 4)
    const fileKeys = [
      "screenshot1File",
      "screenshot2File",
      "screenshot3File",
      "screenshot4File",
    ] as const;

    fileKeys.forEach((key) => {
      const file = jobData[key];
      if (file) formData.append("files", file); // field name must be 'files'
    });

    try {
      setLoading(true);
      const res = await createSubmission(jobId, formData);
      console.log(res, "res after submission");
      if (res?.success) {
        toast.success("✅ Job submitted successfully!");
        navigate.push("/user/dashboard/workplace");
        setLoading(false);
      } else {
        toast.error(res?.message || "❌ Submission failed!");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong!");
      setLoading(false);
    }
  };

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
                <p className="font-semibold">{job.postedBy.name}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Rules Section */}
      <Card className="border-info/20 bg-info/5">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-info">
            {job?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">
                প্রফেশনাল থেকে প্রত্যাশিত কাজসমূহ
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                অপনাদি সঠিক ভাবে কাজটি করুন। আমি ও সঠিক ভাবে আপনার কাজটি করবো।
              </p>
            </div>

            <div className="space-y-3">
              {job?.description
                ?.split("\n")
                .filter((line) => line.trim() !== "")
                .map((line: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-success rounded-sm flex-shrink-0 mt-0.5"></div>
                    <p className="text-sm">{line}</p>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Work URL Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">কাজের লিঙ্ক (কপি)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <span className="font-mono text-sm">
                {job?.jobUrl || "No URL provided"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (job?.jobUrl) {
                    navigator.clipboard.writeText(job.jobUrl);
                    toast.success("URL কপি করা হয়েছে!");
                  }
                }}
              >
                📋 Copy
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Job Completion Form */}
        <Card>
          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {job?.screenshotTitles?.map((title: string, idx: number) => {
                  const fieldName = `screenshot${
                    idx + 1
                  }File` as keyof typeof jobData;

                  return (
                    <div key={idx} className="space-y-2 border p-4 rounded-lg">
                      <p className="text-sm font-medium">
                        {idx + 1}. {title}
                      </p>

                      {/* File input */}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleInputChange(
                            fieldName,
                            e.target.files?.[0] || null
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  );
                })}
                <div className="w-full aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={job?.thumbnail || "/placeholder.png"}
                    alt="Job Thumbnail"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-center pt-6">
                <Button
                  disabled={loading}
                  type="submit"
                  className="px-12 py-3 bg-primary hover:bg-primary/90 w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Job"
                  )}
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
