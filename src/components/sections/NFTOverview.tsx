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
  artist_name: string;
  description: string;
  photo_1: string;
  certificate_1: string;
  for_sale: string;
  selling_price: string;
};

export default function NFTOverview() {
  const [search, setSearch] = useState("");
  const [filteredNFTs, setFilteredNFTs] = useState<NFT[]>([]);
  const [wallet, setWallet] = useState("rBK4ZGt13YKjdBaB5FbZyoiTB2NubEQief");

  useEffect(() => {
    const results = nftLedgerData.filter(
      (nft) =>
        nft.owner_wallet === wallet &&
        nft.nft_title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredNFTs(results);
  }, [search, wallet]);

  return (
    <div className="p-6 max-w-[1500px] mx-auto">
      <Input
        placeholder="Search NFTs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-2 border rounded-md"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-4 justify-center">
        {filteredNFTs.map((nft, index) => (
          <Card
            key={nft.nft_id}
            className={`w-full max-w-[350px] shadow-md rounded-lg overflow-hidden ${
              index % 3 === 0 ? 'justify-self-start' : index % 3 === 2 ? 'justify-self-end' : 'justify-self-center'
            }`}
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
              <p className="text-sm text-gray-600 mt-2">{nft.description}</p>
              
              {nft.certificate_1 ? (
                <a
                  href={nft.certificate_1}
                  target="_blank"
                  className="text-blue-500 text-sm mt-2 inline-block"
                >
                  View Certificate
                </a>
              ) : (
                <div className="text-red-500 text-sm mt-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 102 0V7a1 1 0 10-2 0v6zm1-8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Artwork not verified
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
