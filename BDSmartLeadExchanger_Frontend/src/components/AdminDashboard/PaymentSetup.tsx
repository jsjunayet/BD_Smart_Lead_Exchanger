"use client";

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
import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeletons";
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
  createPaymentSetup,
  deletedPaymentSetup,
  getAllPaymentSetup,
  UpdatePaymentSetup,
} from "@/services/paymentSetupService";
// import your server functions
import { CreditCard, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PaymentRate {
  _id?: string;
  type: string;
  rate: string;
  number: string;
}

export default function AdminPaymentSetup() {
  const { user } = useUser();
  const [paymentRates, setPaymentRates] = useState<PaymentRate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<PaymentRate | null>(null);
  const [formData, setFormData] = useState<PaymentRate>({
    type: "",
    rate: "",
    number: "",
  });
  const [loading, setloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data from backend
  const fetchPaymentRates = async () => {
    try {
      setIsLoading(true);
      const data = await getAllPaymentSetup();
      console.log(data.data);
      setPaymentRates(data?.data || []);
    } catch (error: any) {
      toast("Error fetching payment setups");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentRates();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editingRate?._id) {
        setloading(true);
        await UpdatePaymentSetup(editingRate._id, formData);
        toast("Payment Rate Updated");
        setloading(false);
      } else {
        console.log(formData);
        setloading(true);

        await createPaymentSetup(formData);
        toast("Payment Rate Created");
        setloading(false);
      }
      setFormData({ type: "", rate: "0", number: "" });
      setEditingRate(null);
      setIsDialogOpen(false);
      fetchPaymentRates();
      setloading(false);
      // refresh table
    } catch (error: any) {
      toast(`${error.message}`);
      setloading(false);
    }
  };

  const handleEdit = (rate: PaymentRate) => {
    setEditingRate(rate);
    setFormData(rate);
    setIsDialogOpen(true);
  };

  const handleDelete = async (rateId: string) => {
    try {
      await deletedPaymentSetup(rateId);
      toast("Payment Rate Deleted");
      fetchPaymentRates();
    } catch (error: any) {
      toast("Error deleting rate");
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <PageHeaderSkeleton />
      ) : (
        <div className="md:flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-2 md:mb-0">Payment Setup</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Payment Rate
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRate ? "Edit Payment Rate" : "Add Payment Rate"}
              </DialogTitle>
              <DialogDescription>
                {editingRate
                  ? "Update payment rate configuration"
                  : "Configure a new payment method"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Payment Type *</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    placeholder="bKash, Nagad, Rocket..."
                  />
                </div>
                <div>
                  <Label htmlFor="rate">Rate (%) *</Label>
                  <Input
                    id="rate"
                    type="text"
                    value={formData.rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rate: e.target.value,
                      })
                    }
                    placeholder="Amount"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="number">Payment Number *</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  placeholder="+880"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={loading || user?.role !== "superAdmin"}
                onClick={handleSubmit}
              >
                {loading
                  ? editingRate
                    ? "Updating..."
                    : "Creating..."
                  : editingRate
                  ? "Update"
                  : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

)}  
      {/* Payment Rates Table */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="p-0">
          {isLoading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Payment Number</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRates.map((rate) => (
                  <TableRow key={rate._id} className="hover:bg-muted/20">
                    <TableCell className="font-medium flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" /> {rate.type}
                    </TableCell>
                    <TableCell>{rate.number} </TableCell>

                    <TableCell>{rate.rate} tk</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(rate)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={user?.role !== "superAdmin"}
                        className="text-destructive"
                        onClick={() => handleDelete(rate._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
}
