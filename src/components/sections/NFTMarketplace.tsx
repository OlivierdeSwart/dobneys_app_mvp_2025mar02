"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { isInstalled, sendPayment } from "@gemwallet/api";
import nftLedgerData from "../../data/nft_ledger.json";

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

    const amountInDrops = (parseFloat(nft.selling_price) * 1_000_000).toString();

    isInstalled().then(async (response) => {
      if (response.result.isInstalled) {
        console.log("GemWallet detected. Initiating payment...");

        try {
          const paymentPayload = {
            amount: amountInDrops, // In drops
            destination: nft.owner_wallet,
          };

          const transactionResponse = await sendPayment(paymentPayload);

          if (transactionResponse.type === "response" && transactionResponse.result?.hash) {
            console.log("Transaction Successful: ", transactionResponse.result.hash);
            setTransactionStatus(`Transaction Hash: ${transactionResponse.result.hash}`);
          } else {
            console.error("Transaction rejected or failed.");
            setTransactionStatus("Transaction failed or rejected.");
          }
        } catch (error) {
          console.error("Error sending payment:", error);
          setTransactionStatus("Error processing transaction.");
        }
      } else {
        console.warn("GemWallet is not installed.");
        setTransactionStatus("GemWallet not detected. Install the extension.");
      }
    });
  };

  return (
    <div className="p-6 max-w-[1500px] mx-auto">
      <Input
        placeholder="Search NFTs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full p-3 border border-gray-300 rounded-lg"
      />
      {transactionStatus && (
        <div className="mb-4 text-center text-blue-600 font-semibold">{transactionStatus}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nftsForSale.length > 0 ? (
          nftsForSale.map((nft, index) => (
            <Card
              key={nft.nft_id}
              className="w-full max-w-[350px] shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-transform transform hover:scale-105"
            >
              <Image
                src={nft.photo_1}
                alt={nft.nft_title}
                width={300}
                height={400}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{nft.nft_title}</h2>
                <p className="text-sm text-gray-500 italic">By {nft.artist_name || "Unknown Artist"}</p>
                <p className="text-sm text-gray-600">{nft.description}</p>

                {nft.certificate_1 ? (
                  <a
                    href={nft.certificate_1}
                    target="_blank"
                    className="text-blue-500 text-sm mt-2 inline-block"
                  >
                    View Certificate
                  </a>
                ) : (
                  <p className="text-red-500 text-sm mt-2">No Certificate</p>
                )}

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    {nft.selling_price} XRP
                  </span>
                  <Button
                    onClick={() => handleBuyNow(nft)}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No NFTs available for sale.
          </p>
        )}
      </div>
    </div>
  );
}
