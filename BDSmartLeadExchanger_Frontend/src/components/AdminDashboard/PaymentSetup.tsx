import { DataTablePagination } from "@/components/admin/DataTablePagination";
import { SearchInput } from "@/components/admin/SearchInput";
import { StatsCard } from "@/components/admin/StatsCard";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Download,
  Edit,
  Filter,
  Percent,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

interface PaymentRate {
  _id: string;
  type: string;
  rate: number;
  minimumAmount: number;
  maximumAmount: number;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Mock data for payment rates
const mockPaymentRates: PaymentRate[] = [
  {
    _id: "1",
    type: "bKash",
    rate: 2.5,
    minimumAmount: 10,
    maximumAmount: 5000,
    description: "Mobile financial service charges",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    type: "Nagad",
    rate: 2.0,
    minimumAmount: 10,
    maximumAmount: 3000,
    description: "Digital payment service fees",
    status: "active",
    createdAt: "2024-01-14T09:20:00Z",
    updatedAt: "2024-01-14T09:20:00Z",
  },
  {
    _id: "3",
    type: "Rocket",
    rate: 3.0,
    minimumAmount: 20,
    maximumAmount: 2000,
    description: "Mobile banking charges",
    status: "inactive",
    createdAt: "2024-01-13T14:45:00Z",
    updatedAt: "2024-01-13T14:45:00Z",
  },
  {
    _id: "4",
    type: "Bank Transfer",
    rate: 1.5,
    minimumAmount: 100,
    maximumAmount: 10000,
    description: "Bank transfer processing fees",
    status: "active",
    createdAt: "2024-01-12T11:15:00Z",
    updatedAt: "2024-01-12T11:15:00Z",
  },
];

export default function AdminPaymentSetup() {
  const [paymentRates, setPaymentRates] =
    useState<PaymentRate[]>(mockPaymentRates);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<PaymentRate | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    rate: "",
    minimumAmount: "",
    maximumAmount: "",
    description: "",
    status: "active" as "active" | "inactive",
  });
  const { toast } = useToast();

  // Filter and paginate payment rates
  const filteredRates = useMemo(() => {
    return paymentRates.filter((rate) => {
      const matchesSearch =
        rate.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || rate.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [paymentRates, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredRates.length / itemsPerPage);
  const paginatedRates = filteredRates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const stats = useMemo(() => {
    const totalRates = paymentRates.length;
    const activeRates = paymentRates.filter(
      (r) => r.status === "active"
    ).length;
    const inactiveRates = paymentRates.filter(
      (r) => r.status === "inactive"
    ).length;
    const avgRate =
      paymentRates.reduce((sum, r) => sum + r.rate, 0) / paymentRates.length;

    return {
      totalRates,
      activeRates,
      inactiveRates,
      avgRate: parseFloat(avgRate.toFixed(2)),
    };
  }, [paymentRates]);

  const handleSubmit = () => {
    if (
      !formData.type ||
      !formData.rate ||
      !formData.minimumAmount ||
      !formData.maximumAmount
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newRate: PaymentRate = {
      _id: editingRate ? editingRate._id : Date.now().toString(),
      type: formData.type,
      rate: parseFloat(formData.rate),
      minimumAmount: parseFloat(formData.minimumAmount),
      maximumAmount: parseFloat(formData.maximumAmount),
      description: formData.description,
      status: formData.status,
      createdAt: editingRate ? editingRate.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingRate) {
      setPaymentRates(
        paymentRates.map((rate) =>
          rate._id === editingRate._id ? newRate : rate
        )
      );
      toast({
        title: "Payment Rate Updated",
        description: "Payment rate has been successfully updated",
      });
    } else {
      setPaymentRates([...paymentRates, newRate]);
      toast({
        title: "Payment Rate Created",
        description: "New payment rate has been successfully created",
      });
    }

    resetForm();
  };

  const handleEdit = (rate: PaymentRate) => {
    setEditingRate(rate);
    setFormData({
      type: rate.type,
      rate: rate.rate.toString(),
      minimumAmount: rate.minimumAmount.toString(),
      maximumAmount: rate.maximumAmount.toString(),
      description: rate.description,
      status: rate.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (rateId: string) => {
    setPaymentRates(paymentRates.filter((rate) => rate._id !== rateId));
    toast({
      title: "Payment Rate Deleted",
      description: "Payment rate has been successfully deleted",
      variant: "destructive",
    });
  };

  const resetForm = () => {
    setFormData({
      type: "",
      rate: "",
      minimumAmount: "",
      maximumAmount: "",
      description: "",
      status: "active",
    });
    setEditingRate(null);
    setIsDialogOpen(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payment Setup
          </h1>
          <p className="text-muted-foreground">
            Configure payment methods, rates, and transaction limits for your
            platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Rates
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Payment Rate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingRate ? "Edit Payment Rate" : "Add New Payment Rate"}
                </DialogTitle>
                <DialogDescription>
                  {editingRate
                    ? "Update payment rate configuration"
                    : "Configure a new payment method with rates and limits"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Payment Type *</Label>
                    <Input
                      id="type"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      placeholder="e.g., bKash, Nagad, Bank Transfer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate (%) *</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.1"
                      value={formData.rate}
                      onChange={(e) =>
                        setFormData({ ...formData, rate: e.target.value })
                      }
                      placeholder="2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Minimum Amount *</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      value={formData.minimumAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimumAmount: e.target.value,
                        })
                      }
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Maximum Amount *</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      value={formData.maximumAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maximumAmount: e.target.value,
                        })
                      }
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of the payment method"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingRate ? "Update Rate" : "Create Rate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Payment Methods"
          value={stats.totalRates}
          icon={CreditCard}
          trend={{ value: 15, label: "from last month", isPositive: true }}
        />
        <StatsCard
          title="Active Methods"
          value={stats.activeRates}
          icon={CreditCard}
          trend={{ value: 5, label: "from last month", isPositive: true }}
        />
        <StatsCard
          title="Inactive Methods"
          value={stats.inactiveRates}
          icon={CreditCard}
          description="Currently disabled"
        />
        <StatsCard
          title="Average Rate"
          value={`${stats.avgRate}%`}
          icon={Percent}
          description="Across all methods"
        />
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center">
              <SearchInput
                placeholder="Search payment methods..."
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Rates Table */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Type</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Amount Limits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRates.map((rate) => (
                <TableRow key={rate._id} className="hover:bg-muted/20">
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        {rate.type}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rate.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {rate.rate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-foreground">
                        ${rate.minimumAmount} - ${rate.maximumAmount}
                      </div>
                      <div className="text-muted-foreground">Min - Max</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {rate.status === "active" ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(rate.updatedAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(rate)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

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
                            <DialogTitle>Delete Payment Rate</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete the{" "}
                              <strong>{rate.type}</strong> payment rate? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(rate._id)}
                            >
                              Delete Rate
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
        totalItems={filteredRates.length}
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
