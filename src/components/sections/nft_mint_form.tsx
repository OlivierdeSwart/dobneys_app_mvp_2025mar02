"use client";

import { useState, useEffect } from "react";
import { getAddress } from "@gemwallet/api";

const NFTMintForm = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nft_id: `NFT_${Date.now()}`,
    owner_wallet: "",
    seller_wallet: null,
    ledger_id: "nft_art_auction_ledger",
    meta_data: "",
    description: "",
    photo_1: "",
    photo_2: "",
    certificate_1: "",
    other_1: "",
    previous_owners: [],
  });

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const response = await getAddress();

      if (response.type === "response" && response.result && response.result.address) {
        setWalletAddress(response.result.address);
        setFormData((prevData) => ({ ...prevData, owner_wallet: response.result?.address || "" }));      }
    };

    fetchWalletAddress();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      meta_data: JSON.stringify({
        artist: formData.meta_data || "Unknown Artist",
        medium: "Digital",
        size: "Unknown",
      }),
    };

    const response = await fetch("/api/addNFT", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    });

    if (response.ok) {
      alert("✅ NFT Created Successfully!");
      setFormData({
        nft_id: `NFT_${Date.now()}`,
        owner_wallet: walletAddress || "",
        seller_wallet: null,
        ledger_id: "nft_art_auction_ledger",
        meta_data: "",
        description: "",
        photo_1: "",
        photo_2: "",
        certificate_1: "",
        other_1: "",
        previous_owners: [],
      });
    } else {
      alert("❌ Failed to create NFT.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create a New NFT</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Artist Name:</label>
          <input
            type="text"
            name="meta_data"
            placeholder="John Doe"
            value={formData.meta_data}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Description:</label>
          <textarea
            name="description"
            placeholder="Describe your NFT..."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Main Image URL:</label>
          <input
            type="text"
            name="photo_1"
            placeholder="https://example.com/image.jpg"
            value={formData.photo_1}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Additional Image URL:</label>
          <input
            type="text"
            name="photo_2"
            placeholder="https://example.com/image2.jpg"
            value={formData.photo_2}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700"
        >
          Submit NFT
        </button>
      </form>
    </div>
  );
};

export default NFTMintForm;
