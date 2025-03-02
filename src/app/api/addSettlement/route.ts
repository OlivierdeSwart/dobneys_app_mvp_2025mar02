import { NextResponse } from "next/server";
import fs from "fs/promises"; // Use async methods
import path from "path";

const filePath = path.join(process.cwd(), "src/data/settlement_ledger.json");

export async function POST(req: Request) {
  try {
    console.log("🟢 Received POST request to /api/addSettlement");

    // ✅ Log incoming request body
    const settlementEntry = await req.json();
    console.log("📌 Incoming JSON:", JSON.stringify(settlementEntry, null, 2));

    let data = [];
    try {
      const fileContents = await fs.readFile(filePath, "utf-8");
      if (fileContents.trim()) {
        data = JSON.parse(fileContents);
        console.log("📖 Loaded existing settlement ledger data.");
      }
    } catch (err) {
      console.warn("⚠ File not found, creating a new one.");
    }

    // ✅ Validate settlementEntry before appending
    if (!settlementEntry || typeof settlementEntry !== "object") {
      console.error("❌ Invalid settlement entry received.");
      return NextResponse.json({ message: "Invalid settlement entry" }, { status: 400 });
    }

    data.push(settlementEntry);
    console.log("✏ Writing new settlement entry to file...");

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    console.log("✅ Settlement entry added successfully!");
    return NextResponse.json({ message: "Settlement entry added successfully!" }, { status: 200 });
} catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error updating settlement ledger:", errMsg);
    return NextResponse.json({ message: "Failed to add settlement entry", error: errMsg }, { status: 500 });
  }
}
