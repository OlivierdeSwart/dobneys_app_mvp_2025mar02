import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/settlement_ledger.json");

export async function POST(req: Request) {
  try {
    // Hardcoded settlement entry for testing
    const settlementEntry = {
      "part_a": {
        "transaction_id": "08383813AA24DC8615469FA9C6007B45CADCB85CE5119CA2D27E4D7258A66DE1",
        "regarding_nft_id": "NFT_3",
        "transaction_type": "nft purchase",
        "timestamp": "2025-03-02T02:48:09.686Z",
        "network": "XRPL",
        "sender": {
          "wallet_address": "",
          "iban_hash": "",
          "swift_bic": "",
          "bank_name": "",
          "country": "",
          "currency": "",
          "balance_before": "",
          "balance_after": ""
        },
        "recipient": {
          "wallet_address": "rJF9ntBXxcJLLMmkVPcFkjJFwcefKnpEv1",
          "iban_hash": "",
          "swift_bic": "",
          "bank_name": "",
          "country": "",
          "currency": ""
        },
        "pool_wallet": "",
        "amount": {
          "value": "",
          "currency": "",
          "converted_value": "",
          "converted_currency": "",
          "exchange_rate": ""
        },
        "fees": {
          "total": "",
          "currency": "",
          "breakdown": {
            "bank_fee": "",
            "intermediary_fee": "",
            "recipient_bank_fee": ""
          }
        },
        "reference": "",
        "transaction_status": "",
        "validated": false
      }
    };

    let data: object[] = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf-8");
      if (fileContents.trim()) {
        data = JSON.parse(fileContents);
      }
    }

    data.push(settlementEntry);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ message: "Settlement entry added successfully!" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating settlement ledger:", error);
    return NextResponse.json({ message: "Failed to add settlement entry" }, { status: 500 });
  }
}
