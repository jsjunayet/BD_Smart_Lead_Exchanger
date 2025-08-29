import { DataTablePagination } from "@/components/admin/DataTablePagination";
import { SearchInput } from "@/components/admin/SearchInput";
import { StatsCard } from "@/components/admin/StatsCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockJobs } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/types";
import {
  Briefcase,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Filter and paginate jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "approved" && job.approvedByAdmin) ||
        (statusFilter === "pending" && !job.approvedByAdmin);

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const approvedJobs = jobs.filter((j) => j.approvedByAdmin).length;
    const pendingJobs = jobs.filter((j) => !j.approvedByAdmin).length;

    return { totalJobs, approvedJobs, pendingJobs };
  }, [jobs]);

  const handleApproveJob = (jobId: string) => {
    setJobs(
      jobs.map((job) =>
        job._id === jobId ? { ...job, approvedByAdmin: true } : job
      )
    );
    toast({
      title: "Job Approved",
      description: "Job has been approved and is now visible to users",
    });
  };

  const handleRejectJob = (jobId: string) => {
    setJobs(jobs.filter((job) => job._id !== jobId));
    toast({
      title: "Job Rejected",
      description: "Job has been rejected and removed",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Job Management
        </h1>
        <p className="text-muted-foreground">
          Review, approve, and manage job postings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          description="All job postings"
        />
        <StatsCard
          title="Approved Jobs"
          value={stats.approvedJobs}
          icon={Check}
          description="Active job postings"
        />
        <StatsCard
          title="Pending Jobs"
          value={stats.pendingJobs}
          icon={Clock}
          description="Awaiting review"
        />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          placeholder="Search jobs by title or description..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {paginatedJobs.map((job) => (
          <Card key={job._id} className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {job.title}
                    </h3>
                    {job.approvedByAdmin ? (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending Review</Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={job.postedBy.image}
                          alt={job.postedBy.name}
                        />
                        <AvatarFallback>
                          {job.postedBy.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {job.postedBy.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Posted by
                        </p>
                      </div>
                    </div>

                    <div className="h-4 w-px bg-border"></div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Screenshots Required
                      </p>
                      <p className="text-xs text-foreground">
                        {job.screenshotTitles.length} screenshots
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Job URL
                      </a>
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{job.title}</DialogTitle>
                          <DialogDescription>
                            Job details and requirements
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Description
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {job.description}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              Required Screenshots
                            </h4>
                            <ul className="space-y-1">
                              {job.screenshotTitles.map((title, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-muted-foreground"
                                >
                                  • {title}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {job.thumbnail && (
                            <div>
                              <h4 className="font-medium text-foreground mb-2">
                                Thumbnail
                              </h4>
                              <img
                                src={job.thumbnail}
                                alt="Job thumbnail"
                                className="rounded-lg max-w-xs"
                              />
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {!job.approvedByAdmin && (
                    <>
                      <Button
                        size="sm"
                        className="bg-success hover:bg-success/90 text-success-foreground"
                        onClick={() => handleApproveJob(job._id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectJob(job._id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {filteredJobs.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredJobs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
}
