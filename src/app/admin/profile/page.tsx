"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { supabase } from "@/lib/supabase";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Lock, 
  Eye, 
  EyeOff,
  Loader2,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AdminProfile = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  created_at: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const browserSupabase = createClient();
    const { data: { user } } = await browserSupabase.auth.getUser();
    
    if (user) {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      if (adminUser) {
        setProfile(adminUser);
      } else {
        setProfile({
          id: user.id,
          email: user.email || "",
          name: "Admin User",
          role: "super_admin",
          status: "active",
          created_at: user.created_at
        });
      }
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const browserSupabase = createClient();
      const { error } = await browserSupabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleStyles: Record<string, string> = {
      super_admin: "bg-purple-100 text-purple-700",
      manager: "bg-blue-100 text-blue-700",
      support: "bg-gray-100 text-gray-700"
    };
    const roleLabels: Record<string, string> = {
      super_admin: "Super Admin",
      manager: "Manager",
      support: "Support"
    };
    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        roleStyles[role] || "bg-gray-100 text-gray-700"
      )}>
        <Shield className="h-3 w-3" />
        {roleLabels[role] || role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-serif font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and manage your account settings</p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-2xl">
              {profile?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div>
              <CardTitle className="text-xl">{profile?.name || "Admin User"}</CardTitle>
              {getRoleBadge(profile?.role || "super_admin")}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <div className="font-medium">{profile?.email}</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </label>
              <div className="font-medium capitalize">
                {profile?.role?.replace("_", " ") || "Super Admin"}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Joined
              </label>
              <div className="font-medium">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })
                  : "N/A"
                }
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Status
              </label>
              <div className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                profile?.status === "active" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              )}>
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  profile?.status === "active" ? "bg-green-500" : "bg-red-500"
                )} />
                {profile?.status === "active" ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-medium">Change Password</h3>
          
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="rounded-xl"
              />
            </div>
            
            <Button 
              onClick={handleChangePassword} 
              disabled={changingPassword || !passwordForm.newPassword}
              className="rounded-xl"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
