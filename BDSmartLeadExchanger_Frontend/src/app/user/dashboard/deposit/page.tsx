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
import { createdeposit, getOwndeposit } from "@/services/depositService";
import { getAllPaymentSetup } from "@/services/paymentSetupService";
import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  History,
  Smartphone,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Deposit = () => {
  const [MyDeposit, setMyDeposit] = useState([]);
  const [activeTable, setActiveTable] = useState("deposit");

  const [isLoading, setIsLoading] = useState(false);
  const [Bkash, setBkash] = useState([]);
  const [depositForm, setDepositForm] = useState({
    amount: "",
    transactionId: "",
    bkashNumber: "",
  });

  const fetchDeposit = async () => {
    try {
      const res = await getOwndeposit();
      setMyDeposit(res?.data);
    } catch (error) {
      console.error("Error fetching workplace jobs:", error.message);
    }
  };
  const fetchBkash = async () => {
    try {
      const res = await getAllPaymentSetup();
      console.log(res);
      setBkash(res?.data);
    } catch (error) {
      console.error("Error fetching workplace jobs:", error.message);
    }
  };
  useEffect(() => {
    fetchDeposit();
    fetchBkash();
  }, []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      amount: Number(depositForm.amount),
      transactionId: depositForm.transactionId,
      bkashNumber: depositForm.bkashNumber,
    };

    try {
      setIsLoading(true);
      const res = await createdeposit(payload);
      console.log(res);
      if (res?.success) {
        toast("Deposit request submitted successfully");
        setDepositForm({
          amount: "",
          transactionId: "",
          bkashNumber: "",
        });
        fetchDeposit();
        setActiveTable("history");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error(
          "Failed to submit deposit request: " +
            (res?.errorSources?.map((err: any) => err.message).join(", ") ||
              "Unknown error")
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating deposit:", error);
    }
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

      <Tabs
        defaultValue="deposit"
        value={activeTable}
        onValueChange={(val) => setActiveTable(val)}
        className="w-full"
      >
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
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    {isLoading ? "Submitting..." : "Submit Deposit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="space-y-6">
              <Card className="border-blue-200 bg-blue-50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl font-semibold text-blue-900">
                    কিভাবে টাকা জমা করবেন
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-sm text-blue-800 space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-start space-x-3">
                    <StepNumber>১</StepNumber>
                    <div>
                      <p className="font-medium">বিকাশে টাকা পাঠান</p>
                      <p>
                        আমাদের বিকাশ মার্চেন্ট নম্বরে টাকা পাঠান:{" "}
                        <strong className="text-blue-900">
                          {Bkash.length > 0
                            ? Bkash[0].number
                            : "No number available"}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start space-x-3">
                    <StepNumber>২</StepNumber>
                    <div>
                      <p className="font-medium">বর্তমান ডলার রেট জানুন</p>
                      <p>
                        বর্তমানে ১ ডলারের মূল্য{" "}
                        <span className="font-semibold text-blue-900">
                          {Bkash.length > 0 ? Bkash[0].rate : "132"} টাকা
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start space-x-3">
                    <StepNumber>৩</StepNumber>
                    <div>
                      <p className="font-medium">লেনদেনের তথ্য সংরক্ষণ করুন</p>
                      <p>বিকাশ রিসিপ্ট থেকে ট্রানজেকশন আইডি কপি করে রাখুন</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start space-x-3">
                    <StepNumber>৪</StepNumber>
                    <div>
                      <p className="font-medium">রিকোয়েস্ট সাবমিট করুন</p>
                      <p>ফর্ম পূরণ করে আপনার জমার রিকোয়েস্ট পাঠিয়ে দিন</p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-start space-x-3">
                    <StepNumber>৫</StepNumber>
                    <div>
                      <p className="font-medium">যাচাইয়ের জন্য অপেক্ষা করুন</p>
                      <p>
                        অ্যাডমিন ২৪ ঘন্টার মধ্যে আপনার জমা যাচাই ও অনুমোদন করবে
                      </p>
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
                    {MyDeposit?.map((deposit) => (
                      <TableRow key={deposit.id}>
                        <TableCell>
                          {new Date(deposit.createdAt).toLocaleDateString()}
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
                          {deposit.message && (
                            <span className="text-sm text-gray-600">
                              {deposit.message}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {MyDeposit?.length === 0 && (
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
function StepNumber({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
      {children}
    </div>
  );
}
