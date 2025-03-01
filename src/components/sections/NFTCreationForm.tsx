"use client";

import { useState, useEffect } from "react";
import { getAddress } from "@gemwallet/api";

const NFTCreationForm = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    owner_wallet: "",
    nft_id: `NFT_${Date.now()}`,
    nft_title: "",
    description: "",
    photo_1: null as File | null,
    certificate_1: "http://localhost:3000/uploads/docs/certificate_of_authenticity.pdf",
    seller_wallet: "",
    artist_wallet: "",
    meta_data: "",
    previous_owner_1: "",
    previous_owner_2: "",
    other_1: "",
    ledger_id: "",
    memo_id: "",
  });

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const response = await getAddress();
      if (response.type === "response" && response.result) {
        const address = response.result.address;
        if (address) {
          setWalletAddress(address);
          setFormData((prevData) => ({ ...prevData, owner_wallet: address }));
        }
      }
    };
    fetchWalletAddress();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file" && files && files.length > 0) {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/addNFT", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("✅ NFT Created Successfully!");
      setFormData({
        owner_wallet: walletAddress || "",
        nft_id: `NFT_${Date.now()}`,
        nft_title: "",
        description: "",
        photo_1: null,
        certificate_1: "http://localhost:3000/uploads/docs/certificate_of_authenticity.pdf",
        seller_wallet: "",
        artist_wallet: "",
        meta_data: "",
        previous_owner_1: "",
        previous_owner_2: "",
        other_1: "",
        ledger_id: "",
        memo_id: "",
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
          <label className="block font-semibold">NFT ID:</label>
          <input type="text" name="nft_id" value={formData.nft_id} readOnly className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed" />
        </div>

        <div>
          <label className="block font-semibold">Owner Wallet:</label>
          <input type="text" name="owner_wallet" value={formData.owner_wallet} readOnly className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed" />
        </div>

        <div>
          <label className="block font-semibold">NFT Title:</label>
          <input type="text" name="nft_title" value={formData.nft_title} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-semibold">Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-semibold">Artist Wallet:</label>
          <input type="text" name="artist_wallet" value={formData.artist_wallet} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-semibold">Memo ID:</label>
          <input type="text" name="memo_id" value={formData.memo_id} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-semibold">Certificate URL:</label>
          <input type="text" name="certificate_1" value={formData.certificate_1} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-semibold">Image Upload:</label>
          <input type="file" name="photo_1" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
          Submit NFT
        </button>
      </form>
    </div>
  );
};

export default NFTCreationForm;