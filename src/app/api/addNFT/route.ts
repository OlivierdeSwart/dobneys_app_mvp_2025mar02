import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/nft_ledger.json");

export async function POST(req: Request) {
  try {
    const nftData = await req.json();

    let data: object[] = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      if (fileContents.trim()) {
        data = JSON.parse(fileContents);
      }
    }

    data.push(nftData);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ message: "NFT added successfully!" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating JSON:", error);
    return NextResponse.json({ message: "Failed to add NFT" }, { status: 500 });
  }
}
