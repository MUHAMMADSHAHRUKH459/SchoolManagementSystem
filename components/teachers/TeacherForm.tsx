"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Gender } from "@/types";

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface TeacherFormData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  gender: Gender;
  dateOfBirth: string;
  joiningDate: string;
  qualification?: string;
  salary: string;
  status: string;
}

interface TeacherSubject {
  subject: Subject;
}

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  gender: Gender;
  dateOfBirth: string;
  joiningDate: string;
  qualification?: string;
  salary: number;
  status: string;
  subjects?: TeacherSubject[];
}

interface TeacherFormProps {
  teacher?: Teacher;
  mode: "create" | "edit";
}

export function TeacherForm({ teacher, mode }: TeacherFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(
    () => teacher?.subjects?.map((ts) => ts.subject) ?? []
  );

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<TeacherFormData>({
      defaultValues: teacher
        ? {
            ...teacher,
            salary: teacher.salary?.toString(),
            dateOfBirth: new Date(teacher.dateOfBirth).toISOString().split("T")[0],
            joiningDate: new Date(teacher.joiningDate).toISOString().split("T")[0],
          }
        : { status: "ACTIVE" },
    });

  useEffect(() => {
    fetch("/api/subjects")
      .then((r) => r.json())
      .then(setSubjects)
      .catch(() => {});
  }, []);

  const toggleSubject = (subject: Subject) => {
    setSelectedSubjects((prev) =>
      prev.find((s) => s.id === subject.id)
        ? prev.filter((s) => s.id !== subject.id)
        : [...prev, subject]
    );
  };

  const onSubmit = async (data: TeacherFormData) => {
    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/teachers/${teacher?.id}` : "/api/teachers";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          subjectIds: selectedSubjects.map((s) => s.id),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Something went wrong");
      }

      toast.success(mode === "edit" ? "Teacher updated!" : "Teacher created!");
      router.push("/teachers");
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
            <Input {...register("firstName", { required: true })} placeholder="First name" />
            {errors.firstName && <p className="text-xs text-destructive">Required</p>}
          </div>

          <div className="space-y-2">
            <Label>Last Name *</Label>
            <Input {...register("lastName", { required: true })} placeholder="Last name" />
            {errors.lastName && <p className="text-xs text-destructive">Required</p>}
          </div>

          <div className="space-y-2">
            <Label>Date of Birth *</Label>
            <Input type="date" {...register("dateOfBirth", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Gender *</Label>
            <Select
              defaultValue={teacher?.gender}
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
            <Label>Email *</Label>
            <Input type="email" {...register("email", { required: true })} placeholder="teacher@school.com" />
          </div>

          <div className="space-y-2 sm:col-span-2 lg:col-span-3">
            <Label>Address</Label>
            <Input {...register("address")} placeholder="Full address" />
          </div>
        </CardContent>
      </Card>

      {/* Professional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Employee ID *</Label>
            <Input {...register("employeeId", { required: true })} placeholder="TCH-001" />
          </div>

          <div className="space-y-2">
            <Label>Qualification</Label>
            <Input {...register("qualification")} placeholder="M.Sc, B.Ed etc" />
          </div>

          <div className="space-y-2">
            <Label>Joining Date *</Label>
            <Input type="date" {...register("joiningDate", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label>Monthly Salary *</Label>
            <Input
              type="number"
              {...register("salary", { required: true })}
              placeholder="45000"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              defaultValue={teacher?.status ?? "ACTIVE"}
              onValueChange={(v) => v && setValue("status", v)}
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

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assign Subjects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedSubjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map((s) => (
                <Badge key={s.id} variant="secondary" className="gap-1">
                  {s.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleSubject(s)}
                  />
                </Badge>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {subjects
              .filter((s) => !selectedSubjects.find((ss) => ss.id === s.id))
              .map((s) => (
                <Badge
                  key={s.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => toggleSubject(s)}
                >
                  + {s.name}
                </Badge>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "edit" ? "Update Teacher" : "Create Teacher"}
        </Button>
      </div>
    </form>
  );
}