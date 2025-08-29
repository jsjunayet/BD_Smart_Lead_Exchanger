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
import { mockUsers } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import {
  Crown,
  Download,
  Edit,
  Filter,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const { toast } = useToast();

  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
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

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status && u.isApproved).length;
    const pendingUsers = users.filter((u) => !u.isApproved).length;
    const adminUsers = users.filter((u) => u.role === "admin").length;

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </div>

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
              {paginatedUsers.map((user) => (
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
                          @{user.userName}
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
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUser(user)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit User: {user.name}</DialogTitle>
                            <DialogDescription>
                              View and modify user details and settings.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                  Full Name
                                </label>
                                <p className="text-sm text-muted-foreground p-2 bg-muted/30 rounded">
                                  {user.name}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                  Username
                                </label>
                                <p className="text-sm text-muted-foreground p-2 bg-muted/30 rounded">
                                  @{user.userName}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                  Email Address
                                </label>
                                <p className="text-sm text-muted-foreground p-2 bg-muted/30 rounded">
                                  {user.email}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                  Phone Number
                                </label>
                                <p className="text-sm text-muted-foreground p-2 bg-muted/30 rounded">
                                  {user.phoneNumber}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                  Publisher ID
                                </label>
                                <p className="text-sm text-muted-foreground p-2 bg-muted/30 rounded">
                                  {user.publisherId}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                  Affiliate Network
                                </label>
                                <p className="text-sm text-muted-foreground p-2 bg-muted/30 rounded">
                                  {user.affiliateNetworkName}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                  Location
                                </label>
                                <p className="text-sm text-muted-foreground p-2 bg-muted/30 rounded">
                                  {user.city}, {user.country}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                  Account Status
                                </label>
                                <div className="p-2">
                                  {getStatusBadge(user)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Save Changes</Button>
                          </DialogFooter>
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
        totalItems={filteredUsers.length}
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
