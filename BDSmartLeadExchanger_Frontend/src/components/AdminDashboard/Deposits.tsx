"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Approveddeposit, getAlldeposit } from "@/services/depositService";
import { Check, Eye, Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Deposit {
  _id: string;
  user: {
    name: string;
  };
  amount: number;
  transactionId: string;
  bkashNumber: string;
  status: "pending" | "approved" | "rejected";
  message?: string;
  createdAt: string;
}

const DepositManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const [AllDeposites, setAllDeposites] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeposit = async () => {
    try {
      setIsLoading(true);
      const res = await getAlldeposit();
      console.log(res);
      setAllDeposites(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposit();
  }, []);

  const filteredDeposits = AllDeposites?.filter(
    (deposit) =>
      deposit?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.bkashNumber.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      case "pending":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">Pending</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusUpdate = async (
    depositId: string,
    status: "approved" | "rejected"
  ) => {
    setIsLoading(true);
    const res = await Approveddeposit(depositId, {
      status,
      message: actionMessage,
    });
    if (res.success) {
      toast.success(`Deposit has been ${status}`);
      fetchDeposit();
      setIsLoading(false);
      setSelectedDeposit(null);
      setActionMessage("");
    } else {
      setIsLoading(false);

      toast.error(res.message || "Failed to update deposit status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Deposit Management
          </h1>
          <p className="text-muted-foreground">
            Manage user deposit requests and transactions
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by user or transaction ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deposits Table */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-0">
          {isLoading ? (
            <TableSkeleton rows={10} columns={7} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>bKash Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeposits?.map((deposit: any) => (
                  <TableRow key={deposit._id}>
                    <TableCell>{deposit.user?.name}</TableCell>
                    <TableCell>{deposit.user?.email}</TableCell>

                    <TableCell>৳ {deposit.amount}</TableCell>
                    <TableCell>{deposit.transactionId}</TableCell>
                    <TableCell>{deposit.bkashNumber}</TableCell>
                    <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                    <TableCell>{deposit.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDeposit(deposit)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Deposit Details - {deposit._id}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    User
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {deposit.user?.name}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Amount
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    ৳{deposit.amount}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Transaction ID
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {deposit.transactionId}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    bKash Number
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {deposit.bkashNumber}
                                  </p>
                                </div>
                              </div>

                              {deposit.status === "pending" && (
                                <div className="space-y-3">
                                  <Textarea
                                    placeholder="Add verification message..."
                                    value={actionMessage}
                                    onChange={(e) =>
                                      setActionMessage(e.target.value)
                                    }
                                  />
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          deposit._id,
                                          "approved"
                                        )
                                      }
                                      className="bg-green-500 hover:bg-green-600"
                                    >
                                      {isLoading ? (
                                        <>
                                          <Loader2 className="h-5 w-5 animate-spin" />
                                          Approving...
                                        </>
                                      ) : (
                                        <>
                                          <Check className="h-4 w-4 mr-2" />
                                          Approve
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleStatusUpdate(
                                          deposit._id,
                                          "rejected"
                                        )
                                      }
                                      variant="destructive"
                                    >
                                      {isLoading ? (
                                        <>
                                          <Loader2 className="h-5 w-5 animate-spin" />
                                          Approving...
                                        </>
                                      ) : (
                                        <>
                                          <X className="h-4 w-4 mr-2" />
                                          Reject
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {deposit.message && (
                                <div>
                                  <label className="text-sm font-medium">
                                    Admin Message
                                  </label>
                                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                    {deposit.message}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositManagement;
