import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, FileCheck, AlertTriangle, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Pending Deposits",
      value: "12",
      icon: DollarSign,
      trend: "+2 from yesterday",
      color: "bg-orange-500"
    },
    {
      title: "Total Users",
      value: "847",
      icon: Users,
      trend: "+12 this week",
      color: "bg-blue-500"
    },
    {
      title: "Active Jobs",
      value: "156",
      icon: Briefcase,
      trend: "+8 new today",
      color: "bg-green-500"
    },
    {
      title: "Pending Submissions",
      value: "23",
      icon: FileCheck,
      trend: "+5 recent",
      color: "bg-purple-500"
    },
    {
      title: "Open Reports",
      value: "4",
      icon: AlertTriangle,
      trend: "2 urgent",
      color: "bg-red-500"
    }
  ];

  const recentActivities = [
    { type: "deposit", user: "John Doe", action: "deposited $50", time: "2 hours ago", status: "pending" },
    { type: "job", user: "Sarah Wilson", action: "posted new job", time: "3 hours ago", status: "approved" },
    { type: "submission", user: "Mike Johnson", action: "submitted task proof", time: "4 hours ago", status: "pending" },
    { type: "report", user: "Emma Davis", action: "reported submission", time: "5 hours ago", status: "open" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-500";
      case "approved": return "bg-green-500";
      case "rejected": return "bg-red-500";
      case "open": return "bg-yellow-500";
      default: return "bg-gray-500";
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
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;