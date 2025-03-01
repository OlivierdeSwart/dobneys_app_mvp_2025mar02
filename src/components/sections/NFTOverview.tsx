import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type NFT = {
  owner_wallet: string;
  nft_id: string;
  nft_title: string;
  description: string;
  photo_1: string;
  certificate_1: string;
};

const nftLedger = [
  {
    owner_wallet: "rBK4ZGt13YKjdBaB5FbZyoiTB2NubEQief",
    nft_id: "NFT_1",
    nft_title: "Gilded Fractures Sculpture",
    description:
      "This NFT represents a physical sculpture, a bust with cracks filled with gold, symbolizing the art of kintsugi—turning imperfection into beauty.",
    photo_1: "/uploads/images/nft_1740592613651.jpg",
    certificate_1: "/uploads/docs/certificate_of_authenticity.pdf",
  },
  {
    owner_wallet: "rBK4ZGt13YKjdBaB5FbZyoiTB2NubEQief",
    nft_id: "NFT_2",
    nft_title: "Celebration Amidst Chaos",
    description:
      "This painting depicts a vibrant procession of people and musicians, blending tradition and movement in a lively, yet turbulent scene..",
    photo_1: "/uploads/images/painting1.jpg",
    certificate_1: "/uploads/docs/certificate_of_authenticity.pdf",
  },
  {
    owner_wallet: "rJF9ntBXxcJLLMmkVPcFkjJFwcefKnpEv1",
    nft_id: "NFT_3",
    nft_title: "Warriors of Revolution",
    description:
      "This painting portrays three figures in military attire, exuding strength and determination.",
    photo_1: "/uploads/images/painting2.jpg",
    certificate_1: "/uploads/docs/certificate_of_authenticity.pdf",
  },
];

export default function NFTOverview() {
  const [search, setSearch] = useState("");
  const [filteredNFTs, setFilteredNFTs] = useState<NFT[]>([]);
  const [wallet, setWallet] = useState("rBK4ZGt13YKjdBaB5FbZyoiTB2NubEQief");

  useEffect(() => {
    const results = nftLedger.filter(
      (nft) =>
        nft.owner_wallet === wallet &&
        nft.nft_title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredNFTs(results);
  }, [search, wallet]);

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-4">NFT Overview</h1> */}
      <Input
        placeholder="Search NFTs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-2 border rounded-md"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:max-w-[1500px]gap-4">
        {filteredNFTs.map((nft) => (
          <Card key={nft.nft_id} className="max-w-[350px] shadow-md rounded-lg overflow-hidden">
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
              <a
                href={nft.certificate_1}
                target="_blank"
                className="text-blue-500 text-sm mt-2 inline-block"
              >
                View Certificate
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
