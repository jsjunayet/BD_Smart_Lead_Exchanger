"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllDataDashbaord } from "@/services/jobService";
import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  FileCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// Define proper TypeScript interfaces
interface StatItem {
  title: string;
  value: string;
  trend: string;
  color: string;
}

interface RecentActivity {
  type: "deposit" | "job" | "submission" | "report" | "user";
  user: string;
  action: string;
  time: string;
  status: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );

  console.log(stats, recentActivities);

  const fetchDashboardData = async () => {
    try {
      const response = await getAllDataDashbaord();
      if (response.success) {
        setStats(response?.data.stats || []);
        setRecentActivities(response?.data.recentActivities || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Map stat titles to icons
  const getStatIcon = (title: string) => {
    switch (title) {
      case "Pending Deposits":
        return DollarSign;
      case "Total Users":
        return Users;
      case "Active Jobs":
        return Briefcase;
      case "Pending Submissions":
        return FileCheck;
      case "Open Reports":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "open":
        return "bg-yellow-500";
      case "resolved":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "approved":
        return CheckCircle;
      case "rejected":
        return XCircle;
      case "open":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="secondary">Administrator</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = getStatIcon(stat.title);
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const StatusIcon = getStatusIcon(activity.status);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          activity.status
                        )}`}
                      ></div>
                      <div>
                        <p className="font-medium">{activity.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-2">
                      <StatusIcon className="h-4 w-4" />
                      <Badge
                        variant="outline"
                        className={getStatusColor(activity.status)}
                      >
                        {activity.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No recent activities
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
