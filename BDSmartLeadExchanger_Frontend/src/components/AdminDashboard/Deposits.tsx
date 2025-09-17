"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Check, Eye, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Deposit {
  id: string;
  user: string;
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

  const depositsData: Deposit[] = [
    {
      id: "DEP001",
      user: "John Doe",
      amount: 50,
      transactionId: "TXN123456789",
      bkashNumber: "01712345678",
      status: "pending",
      createdAt: "2024-01-15 10:30 AM",
    },
    {
      id: "DEP002",
      user: "Sarah Wilson",
      amount: 100,
      transactionId: "TXN987654321",
      bkashNumber: "01798765432",
      status: "approved",
      message: "Payment verified successfully",
      createdAt: "2024-01-15 09:15 AM",
    },
    {
      id: "DEP003",
      user: "Mike Johnson",
      amount: 25,
      transactionId: "TXN456789123",
      bkashNumber: "01656789012",
      status: "rejected",
      message: "Invalid transaction ID",
      createdAt: "2024-01-14 08:45 PM",
    },
  ];

  const filteredDeposits = depositsData.filter(
    (deposit) =>
      deposit.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleStatusUpdate = (
    depositId: string,
    status: "approved" | "rejected"
  ) => {
    toast.success(`Deposit ${status} successfully`);
    setActionMessage("");
    setSelectedDeposit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deposit Management</h1>
        <Badge variant="outline">Admin Panel</Badge>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, transaction ID, or bKash number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Deposits Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Deposits ({filteredDeposits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deposit ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>bKash Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeposits.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell className="font-medium">{deposit.id}</TableCell>
                  <TableCell>{deposit.user}</TableCell>
                  <TableCell>${deposit.amount}</TableCell>
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
                              Deposit Details - {deposit.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">
                                  User
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  {deposit.user}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">
                                  Amount
                                </label>
                                <p className="text-sm text-muted-foreground">
                                  ${deposit.amount}
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
                                      handleStatusUpdate(deposit.id, "approved")
                                    }
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      handleStatusUpdate(deposit.id, "rejected")
                                    }
                                    variant="destructive"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositManagement;
