"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  UserPlus,
  Shield,
  CheckCircle2,
  Loader2,
  Copy
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Employee = {
  id: string;
  employee_id: string;
  password: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  
  const [newEmployee, setNewEmployee] = useState({
    employee_id: "",
    password: "",
    name: "",
    role: "employee"
  });
  const [createdEmployee, setCreatedEmployee] = useState<{id: string; password: string; name: string} | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load employees");
    } else {
      setEmployees(data || []);
    }
    setLoading(false);
  };

  const generateEmployeeId = () => {
    const prefix = "EMP";
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${num}`;
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name.trim()) {
      toast.error("Please enter employee name");
      return;
    }

    setSaving(true);
    try {
      const employeeId = newEmployee.employee_id || generateEmployeeId();
      const password = newEmployee.password || generatePassword();

      const { data: existing } = await supabase
        .from("employees")
        .select("id")
        .eq("employee_id", employeeId)
        .single();

      if (existing) {
        toast.error("Employee ID already exists");
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from("employees")
        .insert({
          employee_id: employeeId,
          password: password,
          name: newEmployee.name,
          role: newEmployee.role,
          is_active: true
        });

      if (error) throw error;

      setCreatedEmployee({ id: employeeId, password, name: newEmployee.name });
      setShowAddDialog(false);
      setShowSuccessDialog(true);
      setNewEmployee({ employee_id: "", password: "", name: "", role: "employee" });
      fetchEmployees();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create employee");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Employee deleted successfully");
      setDeleteEmployeeId(null);
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  const toggleEmployeeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("employees")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Employee ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to update employee status");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Employee Management
          </h1>
          <p className="text-muted-foreground">Create and manage employee accounts</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="rounded-full">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Employees Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((emp) => (
          <Card key={emp.id} className={cn(!emp.is_active && "opacity-60")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full font-bold text-white",
                    emp.role === 'admin' ? "bg-purple-500" : "bg-primary"
                  )}>
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-base">{emp.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      {emp.role === 'admin' && <Shield className="h-3 w-3" />}
                      {emp.role}
                    </CardDescription>
                  </div>
                </div>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                  emp.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {emp.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Employee ID</span>
                  <span className="font-mono font-bold text-sm">{emp.employee_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Password</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm">
                      {showPasswords[emp.id] ? emp.password : "••••••••"}
                    </span>
                    <button 
                      onClick={() => setShowPasswords(prev => ({ ...prev, [emp.id]: !prev[emp.id] }))}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {showPasswords[emp.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => toggleEmployeeStatus(emp.id, emp.is_active)}
                >
                  {emp.is_active ? "Deactivate" : "Activate"}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeleteEmployeeId(emp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {employees.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">No employees yet</p>
            <Button 
              onClick={() => setShowAddDialog(true)} 
              className="mt-4 rounded-full"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Employee
            </Button>
          </div>
        )}
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create New Employee
            </DialogTitle>
            <DialogDescription>
              Create login credentials for a new employee
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Employee Name *</Label>
              <Input 
                id="name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter employee name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID (auto-generated if empty)</Label>
              <div className="flex gap-2">
                <Input 
                  id="employeeId"
                  value={newEmployee.employee_id}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, employee_id: e.target.value }))}
                  placeholder="e.g., EMP1234"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setNewEmployee(prev => ({ ...prev, employee_id: generateEmployeeId() }))}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password (auto-generated if empty)</Label>
              <div className="flex gap-2">
                <Input 
                  id="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password or generate"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setNewEmployee(prev => ({ ...prev, password: generatePassword() }))}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newEmployee.role} 
                onValueChange={(value) => setNewEmployee(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmployee} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Employee"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Employee Created Successfully!
            </DialogTitle>
            <DialogDescription>
              Share these credentials with {createdEmployee?.name}
            </DialogDescription>
          </DialogHeader>

          {createdEmployee && (
            <div className="space-y-4 py-4">
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Employee ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-green-900">{createdEmployee.id}</span>
                    <button 
                      onClick={() => copyToClipboard(createdEmployee.id)}
                      className="p-1 hover:bg-green-200 rounded"
                    >
                      <Copy className="h-4 w-4 text-green-700" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Password</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-green-900">{createdEmployee.password}</span>
                    <button 
                      onClick={() => copyToClipboard(createdEmployee.password)}
                      className="p-1 hover:bg-green-200 rounded"
                    >
                      <Copy className="h-4 w-4 text-green-700" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                The employee can use these credentials to log in to the admin panel.
              </p>
            </div>
          )}

          <Button onClick={() => setShowSuccessDialog(false)} className="w-full">
            Done
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteEmployeeId} onOpenChange={() => setDeleteEmployeeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the employee account. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteEmployeeId && handleDeleteEmployee(deleteEmployeeId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
