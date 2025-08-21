"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  History,
  Smartphone,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const Deposit = () => {
  const [depositForm, setDepositForm] = useState({
    amount: "",
    transactionId: "",
    bkashNumber: "",
  });

  const depositHistory = [
    {
      id: 1,
      amount: 5000,
      transactionId: "TXN123456789",
      bkashNumber: "01712345678",
      status: "success",
      date: "2024-01-20",
      adminNote: "Verified successfully",
    },
    {
      id: 2,
      amount: 3000,
      transactionId: "TXN987654321",
      bkashNumber: "01712345678",
      status: "pending",
      date: "2024-01-22",
      adminNote: "",
    },
    {
      id: 3,
      amount: 2000,
      transactionId: "TXN456789123",
      bkashNumber: "01712345678",
      status: "rejected",
      date: "2024-01-18",
      adminNote: "Invalid transaction ID",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Deposit request:", depositForm);
    // Handle deposit submission logic here
  };

  // const stats = {
  //   totalDeposited: depositHistory
  //     .filter((d) => d.status === "success")
  //     .reduce((sum, d) => sum + d.amount, 0),
  //   pendingAmount: depositHistory
  //     .filter((d) => d.status === "pending")
  //     .reduce((sum, d) => sum + d.amount, 0),
  //   totalTransactions: depositHistory.length,
  //   successRate: Math.round(
  //     (depositHistory.filter((d) => d.status === "success").length /
  //       depositHistory.length) *
  //       100
  //   ),
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Deposit Funds</h1>
        <p className="text-gray-600">Add money to your account via bKash</p>
      </div>

      {/* Stats Cards */}

      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Make Deposit</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Deposit History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deposit Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-pink-600" />
                  <span>bKash Deposit</span>
                </CardTitle>
                <CardDescription>
                  Add funds to your account using bKash mobile banking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (৳) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={depositForm.amount}
                        onChange={(e) =>
                          setDepositForm((prev) => ({
                            ...prev,
                            amount: e.target.value,
                          }))
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">Minimum deposit: ৳1</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID *</Label>
                    <Input
                      id="transactionId"
                      placeholder="Enter bKash transaction ID"
                      value={depositForm.transactionId}
                      onChange={(e) =>
                        setDepositForm((prev) => ({
                          ...prev,
                          transactionId: e.target.value,
                        }))
                      }
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Copy the transaction ID from your bKash transaction
                      receipt
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bkashNumber">bKash Number *</Label>
                    <Input
                      id="bkashNumber"
                      placeholder="Enter your bKash number"
                      value={depositForm.bkashNumber}
                      onChange={(e) =>
                        setDepositForm((prev) => ({
                          ...prev,
                          bkashNumber: e.target.value,
                        }))
                      }
                      required
                    />
                    <p className="text-xs text-gray-500">
                      The number you used to send money
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    Submit Deposit Request
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="space-y-6">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">
                    How to Deposit
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Send Money via bKash</p>
                      <p>
                        Send money to our bKash merchant number:{" "}
                        <strong>01XXXXXXXXX</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Save Transaction Details</p>
                      <p>Copy the transaction ID from your bKash receipt</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Submit Request</p>
                      <p>Fill out the form and submit your deposit request</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Wait for Verification</p>
                      <p>
                        Our admin will verify and approve your deposit within 24
                        hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="text-sm text-orange-700">
                      <p className="font-medium mb-1">Important Notes</p>
                      <ul className="space-y-1">
                        <li>• Double-check transaction ID before submitting</li>
                        <li>
                          • Keep your bKash receipt until deposit is approved
                        </li>
                        <li>• Deposits are processed within 24 hours</li>
                        <li>
                          • Contact support if deposit is not approved within 48
                          hours
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-medium text-green-900 mb-1">
                    Need Help?
                  </h4>
                  <p className="text-sm text-green-700 mb-3">
                    Contact us if you face any issues with your deposit
                  </p>
                  <div className="flex justify-center space-x-4 text-sm">
                    <a href="#" className="text-blue-600 hover:underline">
                      WhatsApp
                    </a>
                    <a href="#" className="text-blue-600 hover:underline">
                      Telegram
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Deposit History</CardTitle>
              <CardDescription>
                Track all your deposit transactions and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>bKash Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Admin Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {depositHistory.map((deposit) => (
                      <TableRow key={deposit.id}>
                        <TableCell>
                          {new Date(deposit.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          ৳{deposit.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {deposit.transactionId}
                        </TableCell>
                        <TableCell>{deposit.bkashNumber}</TableCell>
                        <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                        <TableCell>
                          {deposit.adminNote && (
                            <span className="text-sm text-gray-600">
                              {deposit.adminNote}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {depositHistory.length === 0 && (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No deposit history
                  </h3>
                  <p className="text-gray-600">
                    Your deposit transactions will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Deposit;
