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
import { MONTHS } from "@/types";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  salary: number;
}

interface SalaryFormData {
  personId: string;
  month: string;
  year: string;
  basicSalary: string;
  deductions: string;
  advance: string;
  bonus: string;
  remarks: string;
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export function SalaryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [personType, setPersonType] = useState<"teacher" | "staff">("teacher");
  const [persons, setPersons] = useState<Person[]>([]);
  const [basicSalary, setBasicSalary] = useState("");
  const [deductions, setDeductions] = useState("0");
  const [advance, setAdvance] = useState("0");
  const [bonus, setBonus] = useState("0");

  const netSalary =
    (parseFloat(basicSalary) || 0) -
    (parseFloat(deductions) || 0) -
    (parseFloat(advance) || 0) +
    (parseFloat(bonus) || 0);

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<SalaryFormData>({
      defaultValues: {
        month: (new Date().getMonth() + 1).toString(),
        year: currentYear.toString(),
        deductions: "0",
        advance: "0",
        bonus: "0",
        remarks: "",
      },
    });

  useEffect(() => {
    const url = personType === "teacher" ? "/api/teachers" : "/api/staff";
    fetch(url)
      .then((r) => r.json())
      .then((data: Person[]) => setPersons(data))
      .catch(() => {});
  }, [personType]);

  const handlePersonSelect = (personId: string) => {
    setValue("personId", personId);
    const person = persons.find((p) => p.id === personId);
    if (person) {
      const sal = person.salary.toString();
      setBasicSalary(sal);
      setValue("basicSalary", sal);
    }
  };

  const onSubmit = async (data: SalaryFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, personType }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Something went wrong");
      }

      toast.success("Salary record created!");
      router.push("/salary");
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
          <CardTitle className="text-base">Salary Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Person Type */}
          <div className="space-y-2">
            <Label>Person Type *</Label>
            <Select
              defaultValue="teacher"
              onValueChange={(v) => {
                const type = (v ?? "teacher") as "teacher" | "staff";
                setPersonType(type);
                setValue("personId", "");
                setBasicSalary("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Person */}
          <div className="space-y-2 sm:col-span-2">
            <Label>
              Select {personType === "teacher" ? "Teacher" : "Staff"} *
            </Label>
            <Select onValueChange={(v) => handlePersonSelect(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${personType}`} />
              </SelectTrigger>
              <SelectContent>
                {persons.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.employeeId}) — PKR{" "}
                    {Number(p.salary).toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month */}
          <div className="space-y-2">
            <Label>Month *</Label>
            <Select
              defaultValue={(new Date().getMonth() + 1).toString()}
              onValueChange={(v) => setValue("month", v ?? "")}
            >
              <SelectTrigger>
                <SelectValue />
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
              defaultValue={currentYear.toString()}
              onValueChange={(v) => setValue("year", v ?? "")}
            >
              <SelectTrigger>
                <SelectValue />
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

          {/* Basic Salary */}
          <div className="space-y-2">
            <Label>Basic Salary *</Label>
            <Input
              type="number"
              {...register("basicSalary", { required: true })}
              value={basicSalary}
              onChange={(e) => {
                setBasicSalary(e.target.value);
                setValue("basicSalary", e.target.value);
              }}
              placeholder="45000"
            />
            {errors.basicSalary && (
              <p className="text-xs text-destructive">Required</p>
            )}
          </div>

          {/* Deductions */}
          <div className="space-y-2">
            <Label>Deductions</Label>
            <Input
              type="number"
              {...register("deductions")}
              value={deductions}
              onChange={(e) => {
                setDeductions(e.target.value);
                setValue("deductions", e.target.value);
              }}
              placeholder="0"
            />
          </div>

          {/* Advance */}
          <div className="space-y-2">
            <Label>Advance</Label>
            <Input
              type="number"
              {...register("advance")}
              value={advance}
              onChange={(e) => {
                setAdvance(e.target.value);
                setValue("advance", e.target.value);
              }}
              placeholder="0"
            />
          </div>

          {/* Bonus */}
          <div className="space-y-2">
            <Label>Bonus</Label>
            <Input
              type="number"
              {...register("bonus")}
              value={bonus}
              onChange={(e) => {
                setBonus(e.target.value);
                setValue("bonus", e.target.value);
              }}
              placeholder="0"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2 sm:col-span-2">
            <Label>Remarks</Label>
            <Input {...register("remarks")} placeholder="Optional remarks" />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Salary Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Basic Salary</p>
              <p className="text-lg font-bold">
                PKR {parseFloat(basicSalary) || 0}
              </p>
            </div>
            <div className="rounded-lg bg-red-50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Deductions</p>
              <p className="text-lg font-bold text-red-600">
                PKR{" "}
                {(parseFloat(deductions) || 0) + (parseFloat(advance) || 0)}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Bonus</p>
              <p className="text-lg font-bold text-green-600">
                PKR {parseFloat(bonus) || 0}
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-xs text-muted-foreground">Net Salary</p>
              <p className="text-lg font-bold text-primary">
                PKR {netSalary.toFixed(0)}
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
          {loading ? "Saving..." : "Create Salary Record"}
        </Button>
      </div>
    </form>
  );
}