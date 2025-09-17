"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResetPassword } from "@/services/authService";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await ResetPassword(
        { email, newPassword: formData.newPassword },
        token // send token from URL params
      );

      if (res.success) {
        toast.success(res.message || "Password reset successfully");
        setFormData({ newPassword: "", confirmPassword: "" });
        router.push("/login");
      } else {
        toast.error(res.message || "Failed to reset password!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {token ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md"
          >
            <Label>Email</Label>
            <Input
              value={email}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />

            <div className="space-y-2 relative">
              <Label>New Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-5 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            <div className="space-y-2 relative">
              <Label>Confirm Password</Label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 top-5 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
