"use client";

import { useState, useEffect } from "react";
import { getAddress, isInstalled } from "@gemwallet/api";
import { createHash } from "crypto";
import NFTMerkleRootSubmission from "./NFTMerkleRootSubmission";

const NFTCreationForm = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletInstalled, setWalletInstalled] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    owner_wallet: "",
    nft_id: `NFT_${Date.now()}`,
    nft_title: "",
    description: "",
    photo_1: "", // Default empty
    certificate_1: "http://localhost:3000/uploads/docs/certificate_of_authenticity.pdf",
    seller_wallet: "",
    artist_wallet: "",
    meta_data: "",
    previous_owner_1: "",
    previous_owner_2: "",
    other_1: "",
    ledger_id: "",
    memo_id: "",
    for_sale: "",
    selling_price: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [formHash, setFormHash] = useState<string | null>(null);

  useEffect(() => {
    const checkWalletInstallation = async () => {
      try {
        const installationStatus = await isInstalled();
        setWalletInstalled(installationStatus.result.isInstalled);

        if (installationStatus.result.isInstalled) {
          const response = await getAddress();
          if (response.type === "response" && response.result) {
            const address = response.result.address;
            if (address) {
              setWalletAddress(address);
              setFormData((prevData) => ({ ...prevData, owner_wallet: address }));
            }
          }
        }
      } catch (error) {
        console.error("Error checking GemWallet installation:", error);
      }
    };

    checkWalletInstallation();
  }, []);

  // Handle form field changes
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    if (type === "file" && files && files.length > 0) {
      const selectedFile = files[0];

      // Upload image to API
      setUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const uploadResponse = await fetch("/api/uploadImage", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.ok) {
          const { fileUrl } = await uploadResponse.json();
          console.log("✅ Image uploaded successfully:", fileUrl);
          
          setFormData((prevData) => ({ ...prevData, photo_1: fileUrl }));
        } else {
          throw new Error("Upload failed. Response not OK.");
        }
      } catch (error) {
        console.error("❌ Upload error:", error);
        setUploadError("Image upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting NFT Data:", formData);

    // Compute SHA-256 hash
    const hash = createHash("sha256").update(JSON.stringify(formData)).digest("hex");
    setFormHash(hash);

    const response = await fetch("/api/addNFT", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setSubmitted(true);
    } else {
      alert("❌ Failed to create NFT.");
    }
  };

  if (submitted) {
    return (
      <>
        <div className="max-w-2xl mx-auto p-6 bg-green-100 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">✅ NFT Created Successfully!</h2>
          <p>Your NFT has been submitted. You can check the logs for more details.</p>
          <pre className="text-left bg-white p-4 rounded shadow-md overflow-auto text-sm">{JSON.stringify(formData, null, 2)}</pre>
          <pre className="text-left bg-white p-4 rounded shadow-md overflow-auto text-sm">Merkle Tree Root: {formHash}</pre>
        </div>
        <NFTMerkleRootSubmission formHash={formHash} />
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create a New NFT</h2>
      {walletInstalled === false && (
        <p className="text-red-500">⚠ GemWallet is not installed. Please install it.</p>
      )}
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
          {uploading && <p className="text-blue-500">Uploading image...</p>}
          {uploadError && <p className="text-red-500">{uploadError}</p>}
          {formData.photo_1 && (
            <img src={formData.photo_1} alt="NFT Preview" className="mt-2 w-32 h-32 object-cover rounded border" />
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700" disabled={uploading}>
          {uploading ? "Uploading..." : "Submit NFT"}
        </button>
      </form>
    </div>
  );
};

export default NFTCreationForm;
