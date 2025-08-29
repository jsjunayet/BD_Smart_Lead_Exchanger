import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockDeposits,
  mockJobs,
  mockReports,
  mockSubmissions,
  mockUsers,
} from "@/data/mockData";
import {
  AlertTriangle,
  Briefcase,
  CreditCard,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: mockUsers.length,
      icon: Users,
      trend: "+12%",
      color: "text-primary",
    },
    {
      title: "Total Jobs",
      value: mockJobs.length,
      icon: Briefcase,
      trend: "+8%",
      color: "text-success",
    },
    {
      title: "Submissions",
      value: mockSubmissions.length,
      icon: FileText,
      trend: "+23%",
      color: "text-info",
    },
    {
      title: "Pending Deposits",
      value: mockDeposits.filter((d) => d.status === "pending").length,
      icon: CreditCard,
      trend: "-5%",
      color: "text-warning",
    },
    {
      title: "Open Reports",
      value: mockReports.filter((r) => r.status === "pending").length,
      icon: AlertTriangle,
      trend: "+3%",
      color: "text-destructive",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    New user registered
                  </p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Job submission approved
                  </p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Deposit pending review
                  </p>
                  <p className="text-xs text-muted-foreground">
                    10 minutes ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                <p className="font-medium text-foreground">
                  Review Pending Deposits
                </p>
                <p className="text-sm text-muted-foreground">
                  Process user payment requests
                </p>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-warning/10 hover:bg-warning/20 transition-colors">
                <p className="font-medium text-foreground">Handle Reports</p>
                <p className="text-sm text-muted-foreground">
                  Review user reports and issues
                </p>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-success/10 hover:bg-success/20 transition-colors">
                <p className="font-medium text-foreground">Approve Jobs</p>
                <p className="text-sm text-muted-foreground">
                  Review and approve new job postings
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
