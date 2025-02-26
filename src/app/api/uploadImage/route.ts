import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Convert Blob to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define file storage path
    const uploadsDir = path.join(process.cwd(), "public/uploads/images");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true }); // Ensure the directory exists
    }

    // Save the file
    const fileName = `nft_${Date.now()}.jpg`;
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Construct file URL
    const fileUrl = `/uploads/images/${fileName}`;

    console.log("✅ Image uploaded:", fileUrl);
    return NextResponse.json({ message: "Upload successful", fileUrl }, { status: 200 });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
