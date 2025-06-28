import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const logo = formData.get("logo");
    const excel = formData.get("excel");

    const schoolName = formData.get("schoolName");
    const session = formData.get("session");
    const classLevel = formData.get("class_level");
    const passingCriteria = formData.get("passingCriteria");
    const passingPercentage = formData.get("passingPercentage");
    const failedPapers = formData.get("failedPapers");
    const passedPapers = formData.get("passedPapers");
    const subjects = formData.get("subjects");
    const declarationDate = formData.get("declarationDate");
    const examType = formData.get("examType");

    // Validate files
    if (!logo || !excel) {
      return NextResponse.json({ error: "Logo and Excel are required" }, { status: 400 });
    }

    // Save Logo
    const logoBytes = await logo.arrayBuffer();
    const logoPath = path.join(process.cwd(), "public/uploads", logo.name);
    await writeFile(logoPath, Buffer.from(logoBytes));

    // Save Excel
    const excelBytes = await excel.arrayBuffer();
    const excelPath = path.join(process.cwd(), "public/uploads", excel.name);
    await writeFile(excelPath, Buffer.from(excelBytes));

    // Log other fields (Optional)
    console.log({
      schoolName,
      session,
      classLevel,
      passingCriteria,
      passingPercentage,
      failedPapers,
      passedPapers,
      subjects,
      declarationDate,
      examType,
    });

    return NextResponse.json({
      message: "Upload successful",
      data: { students: [], schoolName },
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
