import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

const filePath = path.join(process.cwd(), "src/data/growingData.json");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Get NFT metadata
    const nftData = {
      nft_id: formData.get("nft_id"),
      owner_wallet: formData.get("owner_wallet"),
      seller_wallet: formData.get("seller_wallet") || null,
      ledger_id: formData.get("ledger_id"),
      meta_data: JSON.stringify({
        artist: formData.get("meta_data") || "Unknown Artist",
        medium: "Digital",
        size: "Unknown",
      }),
      description: formData.get("description") || "",
      photo_1: formData.get("photo_1") ? await uploadImage(formData.get("photo_1") as File) : null,
      photo_2: formData.get("photo_2") ? await uploadImage(formData.get("photo_2") as File) : null,
      photo_3: formData.get("photo_3") ? await uploadImage(formData.get("photo_3") as File) : null,
      certificate_1: formData.get("certificate_1") || null,
      other_1: formData.get("other_1") || null,
      previous_owners: [],
    };

    let data: object[] = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      if (fileContents.trim()) {
        data = JSON.parse(fileContents);
      }
    }

    data.push(nftData);
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ message: "NFT submitted successfully!" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in NFT submission:", error);
    return NextResponse.json({ message: "Failed to submit NFT" }, { status: 500 });
  }
}

async function uploadImage(file: File) {
  const uploadsDir = path.join(process.cwd(), "public/uploads/images");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const fileName = `nft_${Date.now()}_${file.name}`;
  const filePath = path.join(uploadsDir, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/images/${fileName}`;
}
