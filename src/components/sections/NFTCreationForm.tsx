"use client";

import { useState, useEffect } from "react";
import { getAddress } from "@gemwallet/api";

const NFTCreationForm = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    nft_id: string;
    owner_wallet: string;
    seller_wallet: string | null;
    ledger_id: string;
    meta_data: string;
    description: string;
    photo_1: File | null;
    photo_2: File | null;
    photo_3: File | null;
    certificate_1: string;
    other_1: string;
    previous_owners: any[];
  }>({
    nft_id: `NFT_${Date.now()}`,
    owner_wallet: "",
    seller_wallet: null,
    ledger_id: "nft_art_auction_ledger",
    meta_data: "",
    description: "",
    photo_1: null,
    photo_2: null,
    photo_3: null,
    certificate_1: "",
    other_1: "",
    previous_owners: [],
  });

  // Fetch the wallet address when the component is mounted
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

  // Handle changes for text inputs and file inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    if (type === "file" && files && files.length > 0) {
      // If it's a file input, set the file
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value || null }));
    }
  };

  // Handle form submission
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

    // Create FormData object for sending file data
    const formDataObj = new FormData();

    // Loop through keys in finalData and append to FormData
    Object.keys(finalData).forEach((key) => {
      const typedKey = key as keyof typeof finalData;
      if (finalData[typedKey] !== null) {
        formDataObj.append(typedKey, finalData[typedKey] as string | Blob);
      }
    });

    const response = await fetch("/api/addNFT", {
      method: "POST",
      body: formDataObj,
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
        photo_1: null,
        photo_2: null,
        photo_3: null,
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
        {/* NFT ID (Read-only) */}
        <div>
          <label className="block font-semibold">NFT ID:</label>
          <input
            type="text"
            name="nft_id"
            value={formData.nft_id}
            readOnly
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Owner Wallet (Read-only) */}
        <div>
          <label className="block font-semibold">Owner Wallet:</label>
          <input
            type="text"
            name="owner_wallet"
            value={formData.owner_wallet}
            readOnly
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Seller Wallet */}
        <div>
          <label className="block font-semibold">Seller Wallet (Optional):</label>
          <input
            type="text"
            name="seller_wallet"
            placeholder="Seller's wallet address"
            value={formData.seller_wallet || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Ledger ID */}
        <div>
          <label className="block font-semibold">Ledger ID:</label>
          <input
            type="text"
            name="ledger_id"
            placeholder="Ledger ID"
            value={formData.ledger_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Artist Name */}
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

        {/* Description */}
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

        {/* Image Uploads */}
        <div>
          <label className="block font-semibold">Image 1 (Optional):</label>
          <input type="file" name="photo_1" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold">Image 2 (Optional):</label>
          <input type="file" name="photo_2" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold">Image 3 (Optional):</label>
          <input type="file" name="photo_3" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        {/* Certificate Upload */}
        <div>
          <label className="block font-semibold">Certificate URL (Optional):</label>
          <input
            type="text"
            name="certificate_1"
            placeholder="https://example.com/certificate.pdf"
            value={formData.certificate_1}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Other Supporting Document */}
        <div>
          <label className="block font-semibold">Other Document URL (Optional):</label>
          <input
            type="text"
            name="other_1"
            placeholder="https://example.com/document.txt"
            value={formData.other_1}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
          Submit NFT
        </button>
      </form>
    </div>
  );
};

export default NFTCreationForm;
