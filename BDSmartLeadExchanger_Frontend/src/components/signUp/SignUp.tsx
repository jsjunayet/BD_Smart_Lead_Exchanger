"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignUpUser } from "@/services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    country: "",
    city: "",
    affiliateNetworkName: "",
    publisherId: "",
    password: "",
    confirmPassword: "",
    address: "",
    // state: "",
    // zipCode: "",
    teamsId: "",
    image: null as File | null, // image field
    agreeToTerms: false,
  });
  const [loading, setloading] = useState(false);

  const handleInputChange = (
    field: string,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast("Passwords do not match!");
      return;
    }

    if (!formData.agreeToTerms) {
      toast("You must agree to terms.");
      return;
    }

    try {
      console.log(formData);
      setloading(true);
      const res = await SignUpUser(formData);
      console.log(res);
      if (res?.success) {
        toast.success(res.message);
        router.push("/login");
        setloading(false);
        setFormData({});
      } else {
        toast.error(res.message);
        setloading(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Sign Up failed:", error.response?.data || error.message);
      toast(error.response?.data?.message || "Sign Up failed!");
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Sign Up In BD Smart Lead Exchnager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your first name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-muted/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userName">User Name * </Label>
                  <Input
                    id="userName"
                    placeholder="Enter your last name"
                    value={formData.userName}
                    onChange={(e) =>
                      handleInputChange("userName", e.target.value)
                    }
                    className="bg-muted/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail * </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-muted/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address * </Label>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City * </Label>
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="bg-muted/50"
                    required
                  />
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="country">Select country * </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      handleInputChange("country", value)
                    }
                    required
                  >
                    <SelectTrigger className="bg-muted/50 w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="United States">
                        United States
                      </SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">
                        United Kingdom
                      </SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number * </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className="bg-muted/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamsId">
                    Teams ID (Skype) or Telegram *{" "}
                  </Label>
                  <Input
                    id="teamsId"
                    placeholder="Enter your Teams/Telegram ID"
                    value={formData.teamsId}
                    onChange={(e) =>
                      handleInputChange("teamsId", e.target.value)
                    }
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="affiliateNetworkName">
                    Affiliate Network Name *{" "}
                  </Label>
                  <Input
                    id="affiliateNetworkName"
                    placeholder="Enter network name"
                    value={formData.affiliateNetworkName}
                    onChange={(e) =>
                      handleInputChange("affiliateNetworkName", e.target.value)
                    }
                    className="bg-muted/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisherId">Publisher ID * </Label>
                  <Input
                    id="publisherId"
                    placeholder="Enter your publisher ID"
                    value={formData.publisherId}
                    onChange={(e) =>
                      handleInputChange("publisherId", e.target.value)
                    }
                    className="bg-muted/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password * </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="bg-muted/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password * </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="bg-muted/50"
                    required
                  />
                </div>
              </div>

              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">
                  Upload Profile ID Screenshot (with Name) *{" "}
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleInputChange(
                      "file",
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="bg-muted/50"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms", checked as boolean)
                }
              />
              <Label
                htmlFor="agreeToTerms"
                className="text-sm text-muted-foreground leading-relaxed"
              >
                I confirm that I have read, understand and agree to the{" "}
                <Link
                  href="/login"
                  className=" text-blue-600 hover:underline font-medium"
                >
                  Already your account
                </Link>
                *{" "}
              </Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                disabled={loading}
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {loading ? "Sign Up..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
