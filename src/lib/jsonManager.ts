const fs = require("fs");
const path = require("path");

// Define the path to the growing JSON file
const filePath = path.join(process.cwd(), "src/data/growingData.json");

// Function to add a new NFT entry
function addNFT() {
    const newNFT = {
        nft_id: `NFT_${Date.now()}`, // Unique NFT ID
        owner_wallet: "0xCurrentOwnerWallet", // Current owner
        seller_wallet: null, // Seller (for future use)
        ledger_id: "nft_art_auction_ledger", // XRPL Ledger association
        meta_data: JSON.stringify({
            artist: "John Doe",
            medium: "Digital",
            size: "5000x5000"
        }), // Metadata as JSON string
        description: "A beautiful digital artwork created by John Doe.",
        photo_1: "https://example.com/images/nft_001_main.jpg",
        photo_2: "https://example.com/images/nft_001_alt1.jpg",
        certificate_1: "https://example.com/certificates/nft_001_auth.pdf",
        other_1: "https://example.com/documents/nft_001_proof.txt",
        previous_owners: []
    };

    try {
        let data: object[] = [];

        // Check if the file exists and read existing data
        if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, "utf-8");
            if (fileContents.trim()) {
                data = JSON.parse(fileContents);
            }
        }

        // Append the new NFT entry
        data.push(newNFT);

        // Write back to the file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
        console.log("✅ New NFT added:", newNFT.nft_id);
    } catch (error) {
        console.error("❌ Error updating JSON:", error);
    }
}

// Run the function when script executes
addNFT();
