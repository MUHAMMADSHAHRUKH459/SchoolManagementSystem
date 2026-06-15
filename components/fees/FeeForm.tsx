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
import { CreateFeeInput, FeeWithStudent, MONTHS, StudentType } from "@/types";

interface FeeFormProps {
  fee?: FeeWithStudent;
  mode: "create" | "edit";
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export function FeeForm({ fee, mode }: FeeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [amount, setAmount] = useState(fee?.amount?.toString() ?? "");
  const [discount, setDiscount] = useState(fee?.discount?.toString() ?? "0");
  const [lateFine, setLateFine] = useState(fee?.lateFine?.toString() ?? "0");
  const [paidAmount, setPaidAmount] = useState(fee?.paidAmount?.toString() ?? "0");

  const totalAmount =
    (parseFloat(amount) || 0) -
    (parseFloat(discount) || 0) +
    (parseFloat(lateFine) || 0);
  const dueAmount = totalAmount - (parseFloat(paidAmount) || 0);

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<CreateFeeInput>({
      defaultValues: fee
        ? {
            studentId: fee.studentId,
            month: fee.month.toString(),
            year: fee.year.toString(),
            amount: fee.amount.toString(),
            discount: fee.discount.toString(),
            lateFine: fee.lateFine.toString(),
            paidAmount: fee.paidAmount.toString(),
            remarks: fee.remarks ?? "",
          }
        : {
            month: (new Date().getMonth() + 1).toString(),
            year: currentYear.toString(),
            discount: "0",
            lateFine: "0",
            paidAmount: "0",
          },
    });

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then(setStudents)
      .catch(() => {});
  }, []);

  const onSubmit = async (data: CreateFeeInput) => {
    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/fees/${fee?.id}` : "/api/fees";
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

      toast.success(mode === "edit" ? "Fee updated!" : "Fee created!");
      router.push("/fees");
      router.refresh();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fee Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Student */}
          <div className="space-y-2 lg:col-span-3">
            <Label>Student *</Label>
            <Select
              defaultValue={fee?.studentId}
              onValueChange={(v) => setValue("studentId", v ?? "")}
              disabled={mode === "edit"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} — Class {s.class}{s.section} (
                    {s.rollNo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month */}
          <div className="space-y-2">
            <Label>Month *</Label>
            <Select
              defaultValue={fee?.month.toString() ?? (new Date().getMonth() + 1).toString()}
              onValueChange={(v) => setValue("month", v ?? (new Date().getMonth() + 1).toString())}
              disabled={mode === "edit"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label>Year *</Label>
            <Select
              defaultValue={fee?.year.toString() ?? currentYear.toString()}
              onValueChange={(v) => setValue("year", v ?? currentYear.toString())}
              disabled={mode === "edit"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Fee Amount *</Label>
            <Input
              type="number"
              {...register("amount", { required: true })}
              placeholder="2500"
              onChange={(e) => {
                setAmount(e.target.value);
                setValue("amount", e.target.value);
              }}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">Required</p>
            )}
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Label>Discount</Label>
            <Input
              type="number"
              {...register("discount")}
              placeholder="0"
              onChange={(e) => {
                setDiscount(e.target.value);
                setValue("discount", e.target.value);
              }}
            />
          </div>

          {/* Late Fine */}
          <div className="space-y-2">
            <Label>Late Fine</Label>
            <Input
              type="number"
              {...register("lateFine")}
              placeholder="0"
              onChange={(e) => {
                setLateFine(e.target.value);
                setValue("lateFine", e.target.value);
              }}
            />
          </div>

          {/* Paid Amount */}
          <div className="space-y-2">
            <Label>Paid Amount</Label>
            <Input
              type="number"
              {...register("paidAmount")}
              placeholder="0"
              onChange={(e) => {
                setPaidAmount(e.target.value);
                setValue("paidAmount", e.target.value);
              }}
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2 sm:col-span-2">
            <Label>Remarks</Label>
            <Input {...register("remarks")} placeholder="Optional remarks" />
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fee Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Fee Amount</p>
              <p className="text-lg font-bold">PKR {parseFloat(amount) || 0}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="text-lg font-bold">PKR {totalAmount.toFixed(0)}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="text-lg font-bold text-green-600">
                PKR {parseFloat(paidAmount) || 0}
              </p>
            </div>
            <div className="rounded-lg bg-red-50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Due</p>
              <p className="text-lg font-bold text-red-600">
                PKR {dueAmount.toFixed(0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "edit" ? "Update Fee" : "Create Fee"}
        </Button>
      </div>
    </form>
  );
}