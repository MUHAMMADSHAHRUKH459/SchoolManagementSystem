"use client";

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
import { AttendanceStatus } from "@prisma/client";
import { AttendanceType } from "@/types";

interface AttendanceRow {
  personId: string;
  name: string;
  identifier: string;
  status: AttendanceStatus;
  remarks: string;
}

interface PersonData {
  id: string;
  firstName: string;
  lastName: string;
  rollNo?: string;
  employeeId?: string;
  class?: string;
  section?: string;
}

const STATUS_OPTIONS: AttendanceStatus[] = [
  "PRESENT",
  "ABSENT",
  "LATE",
  "HALF_DAY",
  "HOLIDAY",
];

const statusColors: Record<AttendanceStatus, string> = {
  PRESENT: "bg-green-100 text-green-800 border-green-200",
  ABSENT: "bg-red-100 text-red-800 border-red-200",
  LATE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  HALF_DAY: "bg-orange-100 text-orange-800 border-orange-200",
  HOLIDAY: "bg-blue-100 text-blue-800 border-blue-200",
};

const CLASSES = ["1","2","3","4","5","6","7","8","9","10","11","12"];

export function AttendanceForm() {
  const [type, setType] = useState<AttendanceType>("student");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  const handleTypeChange = (value: string | null) => {
    const newType = (value ?? "student") as AttendanceType;
    setType(newType);
    setRows([]);
    setSelectedClass("");
  };

  const handleClassChange = (value: string | null) => {
    if (!value || value === "ALL") {
      setSelectedClass("");
    } else {
      setSelectedClass(value);
    }
  };

  const fetchPersons = async () => {
    setFetching(true);
    try {
      let url = "";
      if (type === "student") {
        url = selectedClass
          ? `/api/students?class=${selectedClass}`
          : "/api/students";
      } else if (type === "teacher") {
        url = "/api/teachers";
      } else {
        url = "/api/staff";
      }

      const res = await fetch(url);
      const data: PersonData[] = await res.json();

      const mapped: AttendanceRow[] = data.map((p) => ({
        personId: p.id,
        name: `${p.firstName} ${p.lastName}`,
        identifier:
          type === "student"
            ? `Roll: ${p.rollNo ?? ""} — Class ${p.class ?? ""}${p.section ?? ""}`
            : `ID: ${p.employeeId ?? ""}`,
        status: "PRESENT",
        remarks: "",
      }));

      setRows(mapped);
    } catch {
      toast.error("Failed to fetch persons");
    } finally {
      setFetching(false);
    }
  };

  const updateRow = (
    personId: string,
    field: "status" | "remarks",
    value: string
  ) => {
    setRows((prev) =>
      prev.map((r) =>
        r.personId === personId ? { ...r, [field]: value } : r
      )
    );
  };

  const markAll = (status: AttendanceStatus) => {
    setRows((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleSubmit = async () => {
    if (rows.length === 0) {
      toast.error("No records to save");
      return;
    }

    setLoading(true);
    try {
      const url =
        type === "student"
          ? "/api/attendance/student"
          : type === "teacher"
          ? "/api/attendance/teacher"
          : "/api/attendance/staff";

      const records = rows.map((r) => ({
        ...(type === "student"
          ? { studentId: r.personId }
          : type === "teacher"
          ? { teacherId: r.personId }
          : { staffId: r.personId }),
        date,
        status: r.status,
        remarks: r.remarks || undefined,
      }));

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(`Attendance saved for ${rows.length} records!`);
    } catch {
      toast.error("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const presentCount = rows.filter((r) => r.status === "PRESENT").length;
  const absentCount = rows.filter((r) => r.status === "ABSENT").length;
  const lateCount = rows.filter((r) => r.status === "LATE").length;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attendance Setup</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Type *</Label>
            <Select
              defaultValue="student"
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {type === "student" && (
            <div className="space-y-2">
              <Label>Class (Optional)</Label>
              <Select onValueChange={handleClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Classes</SelectItem>
                  {CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      Class {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button
              type="button"
              onClick={fetchPersons}
              disabled={fetching}
              className="w-full"
            >
              {fetching ? "Loading..." : "Load Records"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary + Mark All */}
      {rows.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{rows.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground self-center">
                  Mark All:
                </span>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => markAll(s)}
                    className={`text-xs px-2 py-1 rounded border font-medium transition-colors ${statusColors[s]}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Rows */}
      {rows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Mark Attendance — {rows.length} records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rows.map((row, index) => (
                <div
                  key={row.personId}
                  className="flex flex-wrap items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                >
                  <span className="text-xs text-muted-foreground w-6 text-right">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-sm font-medium">{row.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.identifier}
                    </p>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateRow(row.personId, "status", s)}
                        className={`text-xs px-2 py-1 rounded border font-medium transition-all ${
                          row.status === s
                            ? statusColors[s] +
                              " ring-2 ring-offset-1 ring-current"
                            : "bg-muted/30 text-muted-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {s === "HALF_DAY" ? "HALF" : s}
                      </button>
                    ))}
                  </div>

                  <Input
                    placeholder="Remarks"
                    value={row.remarks}
                    onChange={(e) =>
                      updateRow(row.personId, "remarks", e.target.value)
                    }
                    className="w-36 h-8 text-xs"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {rows.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            size="lg"
          >
            {loading
              ? "Saving..."
              : `Save Attendance (${rows.length} records)`}
          </Button>
        </div>
      )}
    </div>
  );
}