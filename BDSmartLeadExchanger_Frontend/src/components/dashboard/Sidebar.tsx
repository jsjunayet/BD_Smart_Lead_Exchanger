"use client";

import { cn } from "@/lib/utils";
import { getSingleuser } from "@/services/userService";
import {
  Briefcase,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  PieChart,
  Plus,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Sidebar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ add loading state

  const fetchDeposit = async () => {
    try {
      setIsLoading(true); // start loading
      const res = await getSingleuser();
      console.log(res);
      setUser(res.data); // fixed typo from setuser → setUser
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchDeposit();
  }, []);
  const userMenu = [
    { title: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    { title: "Workplace", href: "/user/dashboard/workplace", icon: Briefcase },
    { title: "My Jobs", href: "/user/dashboard/my-jobs", icon: FileText },
    { title: "Post Job", href: "/user/dashboard/job-post", icon: Plus },
    {
      title: "Work History",
      href: "/user/dashboard/work-history",
      icon: History,
    },
    { title: "Deposit", href: "/user/dashboard/deposit", icon: CreditCard },
    { title: "Profile", href: "/user/dashboard/profile", icon: User },
  ];

  const adminMenu = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    {
      title: "User Management",
      href: "/admin/dashboard/all-users",
      icon: User,
    },
    {
      title: "Deposit Management",
      href: "/admin/dashboard/all-deposits",
      icon: CreditCard,
    },
    {
      title: "Job Management",
      href: "/admin/dashboard/all-jobs",
      icon: Briefcase,
    },
    { title: "Reports", href: "/admin/dashboard/all-reports", icon: History },
    {
      title: "Payment Setup",
      href: "/admin/dashboard/payment-setup",
      icon: User,
    },
    { title: "Statistics", href: "/admin/dashboard/stats", icon: PieChart },

    { title: "Profile", href: "/admin/dashboard/profile", icon: User },
  ];

  if (isLoading) {
    return (
      <div className="w-full lg:w-64 bg-white shadow-lg border-r border-gray-200 lg:min-h-screen p-6 animate-pulse">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 bg-gray-300 rounded-full" />
          <div className="flex flex-col space-y-1">
            <div className="h-3 w-24 bg-gray-300 rounded" />
            <div className="h-2 w-32 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-10 w-full bg-gray-300 rounded" />
            ))}
        </div>
      </div>
    );
  }

  const role = user?.role; // এখানে default দেবেন না, না হলে সবসময় "user" হয়ে যায়
  let menuItems;

  if (role === "superAdmin") {
    // SuperAdmin সব adminMenu route দেখবে + Statistics
    menuItems = [
      ...adminMenu.filter((item) => item.title !== "Statistics"), // adminMenu থেকে Statistics বাদ
      { title: "Statistics", href: "/admin/dashboard/stats", icon: PieChart }, // statistics add
    ];
  } else if (role === "admin") {
    // Admin সব দেখবে কিন্তু Statistics route নয়
    menuItems = adminMenu.filter((item) => item.title !== "Statistics");
  } else {
    // Normal user
    menuItems = userMenu;
  }

  return (
    <div className="w-full lg:w-64 bg-white shadow-lg border-r border-gray-200 lg:min-h-[calc(100vh-4rem)]  top-0">
      <div className="p-4 lg:p-6">
        <div className="p-6 border-b border-border mb-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`${user?.ProfileImage}`} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n: any) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{user?.name || "Guest"}</h3>
              <p className="text-xs text-muted-foreground truncate w-38">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>
        <nav className="space-y-1  lg:space-y-2">
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-0">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex flex-col lg:flex-row items-center lg:space-x-3 px-2 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200 group text-center lg:text-left hover:scale-[1.02] hover:shadow",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors mb-1 lg:mb-0",
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-gray-700"
                    )}
                  />
                  <span className="font-medium text-sm lg:text-base leading-tight">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
