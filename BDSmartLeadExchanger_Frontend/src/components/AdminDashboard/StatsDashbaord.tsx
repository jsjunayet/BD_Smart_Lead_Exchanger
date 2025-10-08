"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createStats,
  deletedStats,
  getAllStats,
  updateStats,
} from "@/services/statsService";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Stat {
  label: string;
  value: string;
}

const StatsDashboard = () => {
  const [Allstatses, setAllstatses] = useState<any[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<any | null>(null);
  const [formData, setFormData] = useState({ label: "", value: "" });
  const fetchstats = async () => {
    try {
      const res = await getAllStats();
      setAllstatses(res?.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchstats();
  }, []);
  const handleCreate = async () => {
    if (!formData.label || !formData.value) {
      return;
    }

    const newStat: Stat = {
      label: formData.label,
      value: formData.value,
    };

    const res = await createStats(newStat);
    console.log(res);
    if (res.success) {
      toast.success(`${res.message}`);
      fetchstats();
      setIsCreateOpen(false);
      setFormData({ label: "", value: "" });
    } else {
      toast.error(`${res.message}`);
    }
  };

  const handleEdit = async () => {
    if (!selectedStat || !formData.label || !formData.value) {
      return;
    }
    const newStat: Stat = {
      label: formData.label,
      value: formData.value,
    };
    const res = await updateStats(selectedStat._id, newStat);
    console.log(res);
    if (res.success) {
      toast.success(`${res.message}`);
      setIsEditOpen(false);
      fetchstats();

      setSelectedStat(null);
      setFormData({ label: "", value: "" });
    } else {
      toast.error(`${res.message}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedStat) return;
    const res = await deletedStats(selectedStat._id);
    if (res.success) {
      toast.success(`${res.message}`);
      setIsEditOpen(false);
      fetchstats();

      setSelectedStat(null);
      setFormData({ label: "", value: "" });
    } else {
      toast.error(`${res.message}`);
    }
  };

  const openEditDialog = (stat: Stat) => {
    setSelectedStat(stat);
    setFormData({ label: stat.label, value: stat.value });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (stat: Stat) => {
    setSelectedStat(stat);
    setIsDeleteOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background rounded-2xl">
      <div className=" w-full py-10 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your application statistics
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Statistics</CardTitle>
              <CardDescription>View and manage your stats</CardDescription>
            </div>
            <Button
              onClick={() => {
                setFormData({ label: "", value: "" });
                setIsCreateOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:opacity-90 transition-opacity"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Stat
            </Button>
          </CardHeader>
          <CardContent>
            {Allstatses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No statistics yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Allstatses?.map((stat) => (
                  <div
                    key={stat.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {stat.label}
                      </h3>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(stat)}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(stat)}
                        className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Stat</DialogTitle>
              <DialogDescription>
                Add a new statistic to your dashboard
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="create-label">Label</Label>
                <Input
                  id="create-label"
                  placeholder="e.g., Total Users"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-value">Value</Label>
                <Input
                  id="create-value"
                  placeholder="e.g., 10,234"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white"
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Stat</DialogTitle>
              <DialogDescription>
                Update the statistic information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-label">Label</Label>
                <Input
                  id="edit-label"
                  placeholder="e.g., Total Users"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">Value</Label>
                <Input
                  id="edit-value"
                  placeholder="e.g., 10,234"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white"
              >
                Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Stat</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedStat?.label}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StatsDashboard;
