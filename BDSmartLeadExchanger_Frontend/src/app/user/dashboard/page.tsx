"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/services/userService";
import { Briefcase, CheckCircle, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [DashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData();
        console.log(response, "dashboard");
        if (response?.success) {
          setDashboardData(response.data);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);
  console.log(DashboardData, "dashboarddata");
  // const recentJobs = [
  //   {
  //     id: 1,
  //     title: "Website Development",
  //     client: "TechCorp Ltd",
  //     status: "completed",
  //     amount: 5000,
  //     completedBy: 8,
  //   },
  // ];

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "completed":
  //       return "bg-green-100 text-green-800";
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "approved":
  //       return "bg-blue-100 text-blue-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, User!</h1>
        <p className="opacity-90">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${DashboardData.Balance || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Daily deduction: ${"0.5"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Posted</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {DashboardData.myJobPostCount || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">Active job posts</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Surfing Balance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {DashboardData.Surfing_Balance || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Jobs completed successfully
            </p>
            {/* <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                Next milestone:{" "}
                {DashboardData.surfingBalance < 10 ? "10 jobs" : "22 jobs"}
              </Badge>
            </div> */}
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tasks
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {DashboardData.MySubmittedJobCount || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">Successfully finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Available Jobs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((job) => (
                <div
                  key={job}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">Logo Design Project</h4>
                    <p className="text-sm text-gray-600">by Creative Studio</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Design
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />2 days left
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">৳2,500</div>
                    <Button size="sm" className="mt-1">
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Jobs
              </Button>
            </div>
          </CardContent>
        </Card>

      
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>My Jobs Completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.client}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {job.completedBy} completed
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">৳{job.amount}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <Star className="h-3 w-3 inline mr-1" />
                      4.8 rating
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Post New Job</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create a new job posting and reach talented professionals
            </p>
            <Button className="w-full">Post Job</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Add Balance</h3>
            <p className="text-sm text-gray-600 mb-4">
              Deposit money to maintain your account and continue posting jobs
            </p>
            <Button className="w-full" variant="outline">
              Deposit Now
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Browse Workplace</h3>
            <p className="text-sm text-gray-600 mb-4">
              Find and complete jobs to increase your surfing balance
            </p>
            <Button className="w-full" variant="outline">
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
