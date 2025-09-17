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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getAlluser } from "@/services/userService";
import { User } from "@/types";
import {
  Check,
  Crown,
  Download,
  Eye,
  Filter,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTablePagination } from "../share/DataTablePagination";
import { SearchInput } from "../share/SearchInput";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAlluser();
        console.log(res); // calls the API route above
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
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

  const totalPages = Math?.ceil(filteredUsers?.length / itemsPerPage);
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const stats = useMemo(() => {
    const totalUsers = users?.length;
    const activeUsers = users?.filter((u) => u.status && u.isApproved).length;
    const pendingUsers = users?.filter((u) => !u.isApproved).length;
    const adminUsers = users?.filter((u) => u.role === "admin").length;

    return { totalUsers, activeUsers, pendingUsers, adminUsers };
  }, [users]);

  const handleRoleChange = (userId: string, newRole: "admin" | "user") => {
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      )
    );
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user._id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been successfully deleted",
      variant: "destructive",
    });
  };

  const getStatusBadge = (user: User) => {
    if (!user.isApproved) return <Badge variant="secondary">Pending</Badge>;
    if (!user.status) return <Badge variant="destructive">Inactive</Badge>;
    return <Badge className="bg-success text-success-foreground">Active</Badge>;
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
            <div className="flex flex-1 gap-4 items-center">
              <SearchInput
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={setSearchTerm}
              />

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[180px]">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers?.map((user) => (
                <TableRow key={user._id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image} alt={user.name} />
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
                  <TableCell>{getStatusBadge(user)}</TableCell>
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
                                <p className="text-muted-foreground">Country</p>
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
                                <p className="text-muted-foreground">Wallet</p>
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
                                <p className="text-muted-foreground">Status</p>
                                <p className="font-medium">
                                  {selectedUser.status ? "Active" : "Inactive"}
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
                                    Profile Image
                                  </p>
                                  <img
                                    src={selectedUser.image}
                                    alt={selectedUser.name}
                                    className="w-24 h-24 rounded-full border mt-1"
                                  />
                                </div>
                              )}
                              {user?.isApproved === false && (
                                <div className="space-y-3">
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() =>
                                        handleStatusUpdate(user.id, "approved")
                                      }
                                      className="bg-green-500 hover:bg-green-600"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleStatusUpdate(user.id, "rejected")
                                      }
                                      variant="destructive"
                                    >
                                      <X className="h-4 w-4 mr-2" />
                                      Reject
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
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
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete User
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers?.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(newItemsPerPage) => {
          setItemsPerPage(newItemsPerPage);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
