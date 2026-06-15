"use client";

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
import { CreateStudentInput, Gender, StudentType } from "@/types";

interface StudentFormProps {
  student?: StudentType;
  mode: "create" | "edit";
}

const CLASSES = ["1","2","3","4","5","6","7","8","9","10","11","12"];
const SECTIONS = ["A", "B", "C", "D"];

export function StudentForm({ student, mode }: StudentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaultValues: CreateStudentInput | undefined = student
    ? {
        rollNo: student.rollNo,
        firstName: student.firstName,
        lastName: student.lastName,
        fatherName: student.fatherName,
        motherName: student.motherName,
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: student.gender,
        phone: student.phone ?? undefined,
        email: student.email ?? undefined,
        address: student.address ?? undefined,
        class: student.class,
        section: student.section,
        admissionNo: student.admissionNo,
      }
    : undefined;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateStudentInput>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<CreateStudentInput> = async (data) => {
    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/students/${student?.id}` : "/api/students";
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

      toast.success(mode === "edit" ? "Student updated!" : "Student created!");
      router.push("/students");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
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
            <Input
              {...register("firstName", { required: true })}
              placeholder="First name"
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">Required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Last Name *</Label>
            <Input
              {...register("lastName", { required: true })}
              placeholder="Last name"
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">Required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date of Birth *</Label>
            <Input
              type="date"
              {...register("dateOfBirth", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>Gender *</Label>
            <Select
              defaultValue={student?.gender}
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
            <Label>Phone</Label>
            <Input {...register("phone")} placeholder="03XX-XXXXXXX" />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="student@email.com"
            />
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-3">
            <Label>Address</Label>
            <Input {...register("address")} placeholder="Full address" />
          </div>
        </CardContent>
      </Card>

      {/* Parent Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parent / Guardian</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Father Name *</Label>
            <Input
              {...register("fatherName", { required: true })}
              placeholder="Father's name"
            />
          </div>
          <div className="space-y-2">
            <Label>Mother Name *</Label>
            <Input
              {...register("motherName", { required: true })}
              placeholder="Mother's name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Academic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Admission No *</Label>
            <Input
              {...register("admissionNo", { required: true })}
              placeholder="ADM-2024-001"
            />
          </div>

          <div className="space-y-2">
            <Label>Roll No *</Label>
            <Input
              {...register("rollNo", { required: true })}
              placeholder="Roll number"
            />
          </div>

          <div className="space-y-2">
            <Label>Class *</Label>
            <Select
              defaultValue={student?.class}
              onValueChange={(v) => v && setValue("class", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {CLASSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Section *</Label>
            <Select
              defaultValue={student?.section}
              onValueChange={(v) => v && setValue("section", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {SECTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    Section {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : mode === "edit"
            ? "Update Student"
            : "Create Student"}
        </Button>
      </div>
    </form>
  );
}