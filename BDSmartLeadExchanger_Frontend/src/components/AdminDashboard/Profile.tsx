"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import {
  Building,
  Camera,
  Crown,
  Edit3,
  Eye,
  EyeOff,
  Hash,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import { mockUsers } from "../share/mockData";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(
    mockUsers.find((user) => user.role === "admin")!
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: admin.name,
    userName: admin.userName,
    email: admin.email,
    phoneNumber: admin.phoneNumber,
    country: admin.country,
    city: admin.city,
    affiliateNetworkName: admin.affiliateNetworkName,
    publisherId: admin.publisherId,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [profileImage, setProfileImage] = useState(admin.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      return;
    }

    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleProfileUpdate = () => {
    setAdmin({
      ...admin,
      ...editForm,
      image: profileImage,
    });
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form if canceling
      setEditForm({
        name: admin.name,
        userName: admin.userName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        country: admin.country,
        city: admin.city,
        affiliateNetworkName: admin.affiliateNetworkName,
        publisherId: admin.publisherId,
      });
      setProfileImage(admin.image);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="space-y-8 max-w-full ">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your profile information and account settings.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1 bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profileImage} alt={admin.name} />
                  <AvatarFallback className="text-xl">
                    {admin.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-1">
                {admin.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                @{admin.userName}
              </p>

              <Badge className="bg-warning text-warning-foreground mb-4">
                <Crown className="h-3 w-3 mr-1" />
                Administrator
              </Badge>

              <div className="w-full space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Wallet Balance
                  </span>
                  <span className="font-semibold text-foreground">
                    ${admin.wallet}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Surfing Balance
                  </span>
                  <span className="font-semibold text-foreground">
                    {admin.surfingBalance}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-4 bg-primary hover:bg-primary/90"
                disabled={!isEditing}
              >
                <Camera className="h-4 w-4 mr-2" />
                {isEditing ? "Change Photo" : "Edit Mode to Change"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2 bg-gradient-card shadow-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <Button
                variant={isEditing ? "destructive" : "outline"}
                onClick={handleEditToggle}
                className="gap-2"
              >
                {isEditing ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={isEditing ? editForm.name : admin.name}
                  onChange={(e) =>
                    isEditing &&
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={isEditing ? editForm.userName : admin.userName}
                  onChange={(e) =>
                    isEditing &&
                    setEditForm({ ...editForm, userName: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={isEditing ? editForm.email : admin.email}
                    onChange={(e) =>
                      isEditing &&
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={isEditing ? editForm.phoneNumber : admin.phoneNumber}
                    onChange={(e) =>
                      isEditing &&
                      setEditForm({ ...editForm, phoneNumber: e.target.value })
                    }
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="country"
                    value={isEditing ? editForm.country : admin.country}
                    onChange={(e) =>
                      isEditing &&
                      setEditForm({ ...editForm, country: e.target.value })
                    }
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={isEditing ? editForm.city : admin.city}
                  onChange={(e) =>
                    isEditing &&
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliate">Affiliate Network</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="affiliate"
                    value={
                      isEditing
                        ? editForm.affiliateNetworkName
                        : admin.affiliateNetworkName
                    }
                    onChange={(e) =>
                      isEditing &&
                      setEditForm({
                        ...editForm,
                        affiliateNetworkName: e.target.value,
                      })
                    }
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher ID</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="publisher"
                    value={isEditing ? editForm.publisherId : admin.publisherId}
                    onChange={(e) =>
                      isEditing &&
                      setEditForm({ ...editForm, publisherId: e.target.value })
                    }
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProfileUpdate}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-foreground">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Change your account password
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          value={passwords.current}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              current: e.target.value,
                            })
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords({ ...passwords, new: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirm: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handlePasswordChange}>
                      Update Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
