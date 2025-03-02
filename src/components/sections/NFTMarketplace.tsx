"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import nftLedgerData from "../../data/nft_ledger.json";

type NFT = {
  owner_wallet: string;
  nft_id: string;
  nft_title: string;
  description: string;
  photo_1: string;
  certificate_1: string;
  for_sale: string;
  selling_price: string;
};

export default function NFTMarketplace() {
  const [search, setSearch] = useState("");
  const [nftsForSale, setNftsForSale] = useState<NFT[]>([]);

  useEffect(() => {
    const results = nftLedgerData.filter(
      (nft) =>
        nft.for_sale.toLowerCase() === "yes" &&
        nft.nft_title.toLowerCase().includes(search.toLowerCase())
    );
    setNftsForSale(results);
  }, [search]);

  return (
    <div className="p-6 max-w-[1500px] mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">NFT Marketplace</h1>
      <Input
        placeholder="Search NFTs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full p-3 border border-gray-300 rounded-lg"
      />
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
                  <Button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
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
