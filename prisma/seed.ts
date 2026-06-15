import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DIRECT_URL!,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding started...");

  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@school.com" },
    update: {},
    create: {
      email: "admin@school.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Admin: admin@school.com / admin123");

  const subjects = [
    { name: "Mathematics", code: "MATH" },
    { name: "English", code: "ENG" },
    { name: "Science", code: "SCI" },
    { name: "Urdu", code: "URD" },
    { name: "Islamiat", code: "ISL" },
    { name: "Computer", code: "COMP" },
    { name: "Physics", code: "PHY" },
    { name: "Chemistry", code: "CHEM" },
    { name: "Biology", code: "BIO" },
    { name: "History", code: "HIST" },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.code },
      update: {},
      create: subject,
    });
  }
  console.log("✅ Subjects created");

  await prisma.teacher.upsert({
    where: { employeeId: "TCH-001" },
    update: {},
    create: {
      employeeId: "TCH-001",
      firstName: "Ali",
      lastName: "Hassan",
      email: "ali.hassan@school.com",
      phone: "0300-1234567",
      gender: "MALE",
      dateOfBirth: new Date("1985-03-15"),
      joiningDate: new Date("2020-01-01"),
      qualification: "M.Sc Mathematics",
      salary: 45000,
      status: "ACTIVE",
    },
  });
  console.log("✅ Sample teacher created");

  await prisma.staff.upsert({
    where: { employeeId: "STF-001" },
    update: {},
    create: {
      employeeId: "STF-001",
      firstName: "Muhammad",
      lastName: "Akram",
      phone: "0311-9876543",
      gender: "MALE",
      role: "PEON",
      salary: 18000,
      joiningDate: new Date("2019-06-01"),
      status: "ACTIVE",
    },
  });
  console.log("✅ Sample staff created");

  const students = [
    {
      rollNo: "2024-001",
      admissionNo: "ADM-2024-001",
      firstName: "Ahmed",
      lastName: "Khan",
      fatherName: "Imran Khan",
      motherName: "Sadia Khan",
      dateOfBirth: new Date("2010-05-20"),
      gender: "MALE" as const,
      phone: "0333-1111111",
      class: "8",
      section: "A",
    },
    {
      rollNo: "2024-002",
      admissionNo: "ADM-2024-002",
      firstName: "Fatima",
      lastName: "Ali",
      fatherName: "Usman Ali",
      motherName: "Nadia Ali",
      dateOfBirth: new Date("2011-08-14"),
      gender: "FEMALE" as const,
      phone: "0333-2222222",
      class: "7",
      section: "B",
    },
    {
      rollNo: "2024-003",
      admissionNo: "ADM-2024-003",
      firstName: "Bilal",
      lastName: "Ahmed",
      fatherName: "Tariq Ahmed",
      motherName: "Rabia Ahmed",
      dateOfBirth: new Date("2009-12-01"),
      gender: "MALE" as const,
      phone: "0333-3333333",
      class: "9",
      section: "A",
    },
  ];

  for (const student of students) {
    await prisma.student.upsert({
      where: { rollNo: student.rollNo },
      update: {},
      create: student,
    });
  }
  console.log("✅ Sample students created");

  console.log("\n🎉 Seeding completed!");
  console.log("🔐 Login: admin@school.com");
  console.log("🔑 Password: admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });