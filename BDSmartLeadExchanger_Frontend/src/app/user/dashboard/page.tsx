"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatsSkeleton } from "@/components/ui/skeletons";
import { getDashboardData } from "@/services/userService";
import { Briefcase, CheckCircle, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [DashboardData, setDashboardData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await getDashboardData();
        if (response?.success) {
          setDashboardData(response.data);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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
      {isLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Available Balance */}
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
                Daily deduction: $0.05
              </p>
            </CardContent>
          </Card>

          {/* Jobs Posted */}
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

          {/* Surfing Balance */}
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
            </CardContent>
          </Card>

          {/* Completed Tasks */}
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
              <p className="text-xs text-gray-600 mt-1">
                Successfully finished
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Post New Job */}
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

        {/* Add Balance */}
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

        {/* Browse Workplace */}
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
