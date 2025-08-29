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
import { mockDeposits } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Deposit } from "@/types";
import {
  Calendar,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Filter,
  Phone,
  Wallet,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState<Deposit[]>(mockDeposits);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Filter and paginate deposits
  const filteredDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      const matchesSearch =
        deposit.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deposit.transactionId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        deposit.bkashNumber.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || deposit.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [deposits, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage);
  const paginatedDeposits = filteredDeposits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const stats = useMemo(() => {
    const totalDeposits = deposits.length;
    const approvedDeposits = deposits.filter(
      (d) => d.status === "approved"
    ).length;
    const pendingDeposits = deposits.filter(
      (d) => d.status === "pending"
    ).length;
    const totalAmount = deposits
      .filter((d) => d.status === "approved")
      .reduce((sum, d) => sum + d.amount, 0);

    return { totalDeposits, approvedDeposits, pendingDeposits, totalAmount };
  }, [deposits]);

  const handleApproveDeposit = (depositId: string) => {
    setDeposits(
      deposits.map((deposit) =>
        deposit._id === depositId ? { ...deposit, status: "approved" } : deposit
      )
    );
    toast({
      title: "Deposit Approved",
      description: "Deposit has been approved and added to user wallet",
    });
  };

  const handleRejectDeposit = (depositId: string) => {
    setDeposits(
      deposits.map((deposit) =>
        deposit._id === depositId ? { ...deposit, status: "rejected" } : deposit
      )
    );
    toast({
      title: "Deposit Rejected",
      description: "Deposit has been rejected",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-success text-success-foreground">Approved</Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending Review</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Deposit Management
        </h1>
        <p className="text-muted-foreground">
          Review and process user deposit requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Deposits"
          value={stats.totalDeposits}
          icon={Wallet}
          description="All deposit requests"
        />
        <StatsCard
          title="Approved"
          value={stats.approvedDeposits}
          icon={Check}
          description="Approved deposits"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingDeposits}
          icon={Clock}
          description="Awaiting review"
        />
        <StatsCard
          title="Total Amount"
          value={`$${stats.totalAmount.toLocaleString()}`}
          icon={DollarSign}
          description="Approved amount"
        />
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          placeholder="Search by user name or transaction ID..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deposits</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {paginatedDeposits.map((deposit) => (
          <Card
            key={deposit._id}
            className="bg-gradient-card shadow-card border-0"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      {formatCurrency(deposit.amount)}
                    </h3>
                    {getStatusBadge(deposit.status)}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={deposit.user.image}
                          alt={deposit.user.name}
                        />
                        <AvatarFallback>
                          {deposit.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {deposit.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{deposit.user.userName}
                        </p>
                      </div>
                    </div>

                    <div className="h-4 w-px bg-border"></div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(deposit.createdAt)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          bKash Number
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {deposit.bkashNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Transaction ID
                        </p>
                        <p className="text-sm font-medium text-foreground font-mono">
                          {deposit.transactionId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {deposit.message && (
                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-foreground">
                        {deposit.message}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Deposit Details</DialogTitle>
                          <DialogDescription>
                            Review deposit information and transaction details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Amount
                              </label>
                              <p className="text-lg font-bold text-primary">
                                {formatCurrency(deposit.amount)}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Status
                              </label>
                              <div className="mt-1">
                                {getStatusBadge(deposit.status)}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                User
                              </label>
                              <div className="flex items-center gap-2 mt-1">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={deposit.user.image}
                                    alt={deposit.user.name}
                                  />
                                  <AvatarFallback>
                                    {deposit.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">
                                    {deposit.user.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {deposit.user.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Date
                              </label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDate(deposit.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                bKash Number
                              </label>
                              <p className="text-sm font-mono text-foreground mt-1">
                                {deposit.bkashNumber}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Transaction ID
                              </label>
                              <p className="text-sm font-mono text-foreground mt-1">
                                {deposit.transactionId}
                              </p>
                            </div>
                          </div>

                          {deposit.message && (
                            <div>
                              <label className="text-sm font-medium text-foreground">
                                Message
                              </label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {deposit.message}
                              </p>
                            </div>
                          )}

                          {deposit.status === "pending" && (
                            <div className="flex gap-2 pt-4 border-t">
                              <Button
                                variant="destructive"
                                onClick={() => handleRejectDeposit(deposit._id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject Deposit
                              </Button>
                              <Button
                                className="bg-success hover:bg-success/90 text-success-foreground"
                                onClick={() =>
                                  handleApproveDeposit(deposit._id)
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Deposit
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {deposit.status === "pending" && (
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => handleApproveDeposit(deposit._id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRejectDeposit(deposit._id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {filteredDeposits.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredDeposits.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
}
