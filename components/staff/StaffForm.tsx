"use client";

import type { Staff } from "@prisma/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gender } from "@/types";

const STAFF_ROLES = [
  "PEON",
  "SWEEPER",
  "GARDENER",
  "ELECTRICIAN",
  "LIBRARIAN",
  "SECURITY",
  "OTHER",
];

interface StaffFormData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  gender: Gender;
  role: string;
  salary: string;
  joiningDate: string;
  status: string;
}

interface StaffFormProps {
  staff?: Staff;
  mode: "create" | "edit";
}

export function StaffForm({ staff, mode }: StaffFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<StaffFormData>({
      defaultValues: staff
        ? {
            employeeId: staff.employeeId,
            firstName: staff.firstName,
            lastName: staff.lastName,
            email: staff.email ?? undefined,
            phone: staff.phone,
            address: staff.address ?? undefined,
            gender: staff.gender,
            role: staff.role,
            salary: staff.salary?.toString() ?? "",
            joiningDate: new Date(staff.joiningDate).toISOString().split("T")[0],
            status: staff.status,
          }
        : { status: "ACTIVE" },
    });

  const onSubmit: SubmitHandler<StaffFormData> = async (data) => {
    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/staff/${staff?.id}` : "/api/staff";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Something went wrong");
      }

      toast.success(mode === "edit" ? "Staff updated!" : "Staff created!");
      router.push("/staff");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>First Name *</Label>
            <Input {...register("firstName", { required: true })} placeholder="First name" />
            {errors.firstName && <p className="text-xs text-destructive">Required</p>}
          </div>

          <div className="space-y-2">
            <Label>Last Name *</Label>
            <Input {...register("lastName", { required: true })} placeholder="Last name" />
            {errors.lastName && <p className="text-xs text-destructive">Required</p>}
          </div>

          <div className="space-y-2">
            <Label>Gender *</Label>
            <Select
              defaultValue={staff?.gender}
              onValueChange={(v) => setValue("gender", v as Gender)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Phone *</Label>
            <Input {...register("phone", { required: true })} placeholder="03XX-XXXXXXX" />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} placeholder="staff@email.com" />
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-3">
            <Label>Address</Label>
            <Input {...register("address")} placeholder="Full address" />
          </div>
        </CardContent>
      </Card>

      {/* Job Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Employee ID *</Label>
            <Input {...register("employeeId", { required: true })} placeholder="STF-001" />
          </div>

          <div className="space-y-2">
            <Label>Role *</Label>
            <Select
              defaultValue={staff?.role}
              onValueChange={(v) => setValue("role", v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Monthly Salary *</Label>
            <Input
              type="number"
              {...register("salary", { required: true })}
              placeholder="18000"
            />
          </div>

          <div className="space-y-2">
            <Label>Joining Date *</Label>
            <Input type="date" {...register("joiningDate", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              defaultValue={staff?.status ?? "ACTIVE"}
              onValueChange={(v) => setValue("status", v ?? "ACTIVE")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "edit" ? "Update Staff" : "Create Staff"}
        </Button>
      </div>
    </form>
  );
}