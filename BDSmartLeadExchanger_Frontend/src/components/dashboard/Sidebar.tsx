"use client";

import { cn } from "@/lib/utils";
import {
  Briefcase,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  MessageSquare,
  Phone,
  Plus,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const Sidebar = () => {
  const pathname = usePathname();

  // const menuItems = [
  //   { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  //   { title: "Workplace", href: "/dashboard/workplace", icon: Briefcase },
  //   { title: "My Jobs", href: "/dashboard/my-jobs", icon: FileText },
  //   { title: "Post Job", href: "/dashboard/job-post", icon: Plus },
  //   { title: "Work History", href: "/dashboard/work-history", icon: History },
  //   { title: "Deposit", href: "/dashboard/deposit", icon: CreditCard },
  //   { title: "Profile", href: "/dashboard/profile", icon: User },
  //   {
  //     title: "Marketing Tools",
  //     href: "/dashboard/marketing-tools",
  //     icon: MessageSquare,
  //   },
  // ];
  const menuItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Workplace", href: "/dashboard/workplace", icon: Briefcase },
    { title: "My Jobs", href: "/dashboard/my-jobs", icon: FileText },
    { title: "Post Job", href: "/dashboard/job-post", icon: Plus },
    { title: "Work History", href: "/dashboard/work-history", icon: History },
    { title: "Deposit", href: "/dashboard/deposit", icon: CreditCard },
    { title: "Profile", href: "/dashboard/profile", icon: User },
    {
      title: "Marketing Tools",
      href: "/dashboard/marketing-tools",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="w-full lg:w-64 bg-white shadow-lg border-r border-gray-200 lg:min-h-[calc(100vh-4rem)] relative">
      <div className="p-4 lg:p-6">
        <div className="p-6 border-b border-border mb-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/hero.png" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">Md Morshed</h3>
              <p className="text-xs text-muted-foreground">Hossain Saidy</p>
            </div>
          </div>
        </div>
        <nav className="space-y-1 lg:space-y-2">
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
        <div className=" border-t border-border mt-4 pt-4">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-1" />
              Telegram
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
