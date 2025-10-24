"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { TableSkeleton } from "@/components/ui/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUser } from "@/context/UserContext";
import {
  Approveduser,
  deleteduser,
  getAlluser,
  userHomeUpdate,
  userRoleUpate,
} from "@/services/userService";
import {
  Check,
  Crown,
  Download,
  Eye,
  Filter,
  Home,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTablePagination } from "../share/DataTablePagination";
import { SearchInput } from "../share/SearchInput";
import { ScreenshotViewer } from "../ui/screenshot-viewer";

export default function AdminUsers() {
  const { user } = useUser();
  const currentUser = user;
  const [users, setUsers] = useState<any[]>();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showViewer, setShowViewer] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await getAlluser();
      console.log(res); // calls the API route above
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  console.log(users);
  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    return users?.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.status && user.isApproved) ||
        (statusFilter === "pending" && !user.isApproved) ||
        (statusFilter === "inactive" && !user.status);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const totalPages = Math.ceil((filteredUsers?.length ?? 0) / itemsPerPage);
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  // const stats = useMemo(() => {
  //   const totalUsers = users?.length;
  //   const activeUsers = users?.filter((u) => u.status && u.isApproved).length;
  //   const pendingUsers = users?.filter((u) => !u.isApproved).length;
  //   const adminUsers = users?.filter((u) => u.role === "admin").length;

  //   return { totalUsers, activeUsers, pendingUsers, adminUsers };
  // }, [users]);

  const handleRoleChange = async (
    userId: string,
    newRole: "admin" | "user"
  ) => {
    console.log(userId, newRole);
    const res = await userRoleUpate(userId, { newRole });
    console.log(res);
    fetchUsers();
    toast.success(`User role has been updated to ${newRole}`);
  };

  const handleDeleteUser = async (userId: string) => {
    const res = await deleteduser(userId);
    console.log(res, "deleted");
    if (res.success) {
      toast.success("User deleted successfully");
      setIsModalOpen(false);
      fetchUsers();
    } else {
      toast.error("Failed to delete user");
    }
  };

  const getStatusBadge = (user: any) => {
    if (!user.isApproved) return <Badge variant="secondary">Pending</Badge>;
    if (!user.status) return <Badge variant="destructive">Inactive</Badge>;
    return <Badge className="bg-success text-success-foreground">Active</Badge>;
  };
  const handleStatusUpdate = async (
    userId: string,
    action: "approved" | "rejected"
  ) => {
    console.log(`User ID: ${userId}, Action: ${action}`);
    setIsLoading(true);
    const res = await Approveduser(userId, action);
    console.log(res, "approved");
    if (res.success) {
      toast.success(`User has been ${action}`);
      setIsLoading(false);
      fetchUsers();
    } else {
      toast.error(`Failed to ${action} user`);
      setIsLoading(false);
    }
  };
  const handleUpdate = async (userId: string) => {
    const res = await userHomeUpdate(userId);
    console.log(res);
    if (res.success) {
      toast.success(`${res.message}`);
      setIsLoading(false);
      fetchUsers();
    } else {
      toast.error(`Failed to Update Home`);
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions across your platform.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Users
        </Button>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UserIcon}
          trend={{ value: 12, label: "from last month", isPositive: true }}
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers}
          icon={UserIcon}
          trend={{ value: 8, label: "from last month", isPositive: true }}
        />
        <StatsCard
          title="Pending Approval"
          value={stats.pendingUsers}
          icon={UserIcon}
          description="Awaiting admin approval"
        />
        <StatsCard
          title="Admin Users"
          value={stats.adminUsers}
          icon={Crown}
          description="Platform administrators"
        />
      </div> */}

      {/* Filters and Search */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="md:flex flex-1 gap-4 items-center md:space-y-0 space-y-2">
              <SearchInput
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={setSearchTerm}
              />

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-[180px] w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="md:w-[180px] w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-0">
          {isLoading ? (
            <TableSkeleton rows={10} columns={6} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers?.map((user: any) => (
                  <TableRow key={user._id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.ProfileImage}
                            alt={user.name}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-2">
                            {user.name}
                            {user.role === "admin" && (
                              <Crown className="h-4 w-4 text-warning" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.userName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm text-foreground">
                          {user.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.phoneNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">
                        {user.city}, {user.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          ${user.wallet}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Surfing: {user.surfingBalance}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        disabled={user.role === "superAdmin"} // ✅ superAdmin হলে পরিবর্তন করা যাবে না
                        onValueChange={(value: "admin" | "user") =>
                          handleRoleChange(user._id, value)
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4" />
                              User
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Crown className="h-4 w-4" />
                              Admin
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className=" text-right">
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={user.role === "superAdmin"}
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>
                                Full information of{" "}
                                <strong>{selectedUser?.name}</strong>
                              </DialogDescription>
                            </DialogHeader>

                            {selectedUser ? (
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Name</p>
                                  <p className="font-medium">
                                    {selectedUser.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Username
                                  </p>
                                  <p className="font-medium">
                                    @{selectedUser.userName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Email</p>
                                  <p className="font-medium">
                                    {selectedUser.email}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Phone</p>
                                  <p className="font-medium">
                                    {selectedUser.phoneNumber}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Country
                                  </p>
                                  <p className="font-medium">
                                    {selectedUser.country}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">City</p>
                                  <p className="font-medium">
                                    {selectedUser.city}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Affiliate Network
                                  </p>
                                  <p className="font-medium">
                                    {selectedUser.affiliateNetworkName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Publisher ID
                                  </p>
                                  <p className="font-medium">
                                    {selectedUser.publisherId}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Role</p>
                                  <p className="font-medium">
                                    {selectedUser.role}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Wallet
                                  </p>
                                  <p className="font-medium">
                                    ${selectedUser.wallet}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Surfing Balance
                                  </p>
                                  <p className="font-medium">
                                    ${selectedUser.surfingBalance}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Approved
                                  </p>
                                  <p className="font-medium">
                                    {selectedUser.isApproved ? "Yes" : "No"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Status
                                  </p>
                                  <p className="font-medium">
                                    {selectedUser.status
                                      ? "Active"
                                      : "Inactive"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Created At
                                  </p>
                                  <p className="font-medium">
                                    {new Date(
                                      selectedUser.createdAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Updated At
                                  </p>
                                  <p className="font-medium">
                                    {new Date(
                                      selectedUser.updatedAt
                                    ).toLocaleString()}
                                  </p>
                                </div>

                                {/* Profile Image */}
                                {selectedUser.image && (
                                  <div className="col-span-2 pt-4">
                                    <p className="text-muted-foreground">
                                      Profile ID ScreenShot
                                    </p>
                                    <Image
                                      height={500}
                                      width={500}
                                      src={selectedUser.image}
                                      alt={selectedUser.name}
                                      onClick={() =>
                                        setShowViewer((prev) => !prev)
                                      }
                                      className="w-24 h-24 rounded-full border mt-1"
                                    />
                                  </div>
                                )}
                                {showViewer && (
                                  <ScreenshotViewer
                                    screenshots={[selectedUser.image]}
                                    titles={["Profile Image"]}
                                    professionalName={
                                      selectedUser.email || selectedUser.name
                                    }
                                    professionalImage={
                                      selectedUser.image || "/placeholder.svg"
                                    }
                                    maxPreview={4}
                                  />
                                )}
                                {user?.isApproved === false && (
                                  <div className="space-y-3">
                                    <div className="flex space-x-2">
                                      <Button
                                        disabled={isLoading}
                                        onClick={() =>
                                          handleStatusUpdate(
                                            user._id,
                                            "approved"
                                          )
                                        }
                                        className="bg-green-500 hover:bg-green-600"
                                      >
                                        <Check className="h-4 w-4 mr-2" />
                                        {isLoading ? "Approve..." : "Approve"}
                                      </Button>
                                      <Button
                                        disabled={isLoading}
                                        onClick={() =>
                                          handleStatusUpdate(
                                            user._id,
                                            "rejected"
                                          )
                                        }
                                        variant="destructive"
                                      >
                                        <X className="h-4 w-4 mr-2" />

                                        {isLoading ? " Reject..." : " Reject"}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-center text-muted-foreground">
                                No user selected
                              </p>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={isModalOpen}
                          onOpenChange={setIsModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              disabled={
                                // Rule:
                                // 1. Admin cannot delete another admin
                                (currentUser?.role === "admin" &&
                                  user?.role === "admin") ||
                                // 2. SuperAdmin can never be deleted by anyone
                                user.role === "superAdmin"
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete User</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete{" "}
                                <strong>{user.name}</strong>? This action cannot
                                be undone and will permanently remove all user
                                data.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteUser(user._id)}
                                disabled={
                                  currentUser?.role !== "superAdmin" &&
                                  user?.role === "admin"
                                }
                              >
                                Delete User
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            // Rule:
                            // 1. Admin cannot delete another admin
                            (currentUser?.role === "admin" &&
                              user?.role === "admin") ||
                            user.role === "user"
                          }
                          onClick={() => handleUpdate(user._id)}
                        >
                          <Home
                            className={`h-5 w-5 transition-colors ${
                              user.home ? "text-green-500" : "text-gray-400"
                            }`}
                          />{" "}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!isLoading && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers?.length ?? 0}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
}
