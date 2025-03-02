"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { isInstalled, sendPayment } from "@gemwallet/api";
import nftLedgerData from "../../data/nft_ledger.json";
import { createHash } from "crypto";

type NFT = {
  owner_wallet: string;
  nft_id: string;
  nft_title: string;
  artist_name: string;
  description: string;
  photo_1: string;
  certificate_1: string;
  for_sale: string;
  selling_price: string;
};

export default function NFTMarketplace() {
  const [search, setSearch] = useState("");
  const [nftsForSale, setNftsForSale] = useState<NFT[]>([]);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [settlementLog, setSettlementLog] = useState<any>(null);

  useEffect(() => {
    const results = nftLedgerData.filter(
      (nft) =>
        nft.for_sale.toLowerCase() === "yes" &&
        nft.nft_title.toLowerCase().includes(search.toLowerCase())
    );
    setNftsForSale(results);
  }, [search]);

  const handleBuyNow = async (nft: NFT) => {
    if (!nft.selling_price || isNaN(parseFloat(nft.selling_price))) {
      console.error("Invalid selling price.");
      return;
    }

    const amountInDrops = (parseFloat(nft.selling_price) * 1).toString();
    const timestamp = new Date().toISOString();

    isInstalled().then(async (response) => {
      if (response.result.isInstalled) {
        console.log("🟢 GemWallet detected. Initiating payment...");
        setTransactionStatus("Transaction Initiated...");

        try {
          const paymentPayload = {
            amount: amountInDrops, // In drops
            destination: nft.owner_wallet,
            memos: [
              {
                memo: {
                  memoData: Buffer.from(nft.nft_id).toString("hex"), // NFT ID converted to hexadecimal
                },
              },
            ],
          };

          const transactionResponse = await sendPayment(paymentPayload);

          if (transactionResponse.type === "response" && transactionResponse.result?.hash) {
            console.log("✅ Transaction Successful: ", transactionResponse.result.hash);
            setTransactionStatus("Transaction Completed!");
            setTransactionHash(transactionResponse.result.hash);

            // ✅ Create the settlement log entry
            const settlementEntry = {
              part_a: {
                transaction_id: transactionResponse.result.hash,
                regarding_nft_id: nft.nft_id,
                transaction_type: "nft purchase",
                timestamp: timestamp,
                network: "XRPL",
                sender: {
                  wallet_address: "",
                  iban_hash: "",
                  swift_bic: "",
                  bank_name: "",
                  country: "",
                  currency: "",
                  balance_before: "",
                  balance_after: "",
                },
                recipient: {
                  wallet_address: nft.owner_wallet,
                  iban_hash: "",
                  swift_bic: "",
                  bank_name: "",
                  country: "",
                  currency: "",
                },
                pool_wallet: "",
                amount: {
                  value: "",
                  currency: "",
                  converted_value: "",
                  converted_currency: "",
                  exchange_rate: "",
                },
                fees: {
                  total: "",
                  currency: "",
                  breakdown: {
                    bank_fee: "",
                    intermediary_fee: "",
                    recipient_bank_fee: "",
                  },
                },
                reference: "",
                transaction_status: "",
                validated: false,
              },
            };

            console.log("📌 Sending JSON to API:", JSON.stringify(settlementEntry, null, 2));

            // ✅ Send settlement entry to API route
            const response = await fetch("/api/addSettlement", {
              method: "POST",
              body: JSON.stringify(settlementEntry),
              headers: { "Content-Type": "application/json" },
            });

            const responseData = await response.json();
            console.log("📩 API Response:", responseData);

            if (response.ok) {
              console.log("✅ Settlement entry successfully added to ledger.");
              // ✅ Set the settlement log for UI display
              setSettlementLog(settlementEntry);
            } else {
              console.error("❌ Failed to update settlement ledger:", responseData);
            }

            console.log("Settlement entry recorded:", settlementEntry);
          } else {
            console.error("❌ Transaction rejected or failed.");
            setTransactionStatus("Transaction failed or rejected.");
          }
        } catch (error) {
          console.error("❌ Error sending payment:", error);
          setTransactionStatus("Error processing transaction.");
        }
      } else {
        console.warn("⚠ GemWallet is not installed.");
        setTransactionStatus("GemWallet not detected. Install the extension.");
      }
    });
  };

  return (
    <div className="p-6 max-w-[1500px] mx-auto">
      {transactionStatus && (
        <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <p className="text-blue-600 font-semibold">{transactionStatus}</p>
          {transactionHash && (
            <p>
              Transaction Hash:{" "}
              <a
                href={`https://testnet.xrpl.org/transactions/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View on XRPL Testnet Explorer
              </a>
            </p>
          )}
        </div>
      )}

      {settlementLog && (
        <div className="mb-4 p-4 bg-gray-200 border border-gray-400 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Settlement Log</h3>
          <pre className="text-sm bg-white p-2 rounded-md border">{JSON.stringify(settlementLog, null, 2)}</pre>
        </div>
      )}

      <Input
        placeholder="Search NFTs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full p-3 border border-gray-300 rounded-lg"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nftsForSale.length > 0 ? (
          nftsForSale.map((nft) => (
            <Card key={nft.nft_id} className="w-full max-w-[350px] shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-transform transform hover:scale-105">
              <Image src={nft.photo_1} alt={nft.nft_title} width={300} height={400} className="w-full h-64 object-cover" />
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{nft.nft_title}</h2>
                <p className="text-sm text-gray-500 italic">By {nft.artist_name || "Unknown Artist"}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">{nft.selling_price} XRP</span>
                  <Button onClick={() => handleBuyNow(nft)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No NFTs available for sale.</p>
        )}
      </div>
    </div>
  );
}
