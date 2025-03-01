const fs = require("fs");
const path = require("path");

// Define the path to the new JSON file
const filePath = path.join(process.cwd(), "src/data/nft_ledger.json");

// Function to add a new NFT entry with mock data
function addMockNFT() {
    const newNFT = {
        owner_wallet: "mock",
        nft_id: `NFT_${Date.now()}`, // Unique NFT ID
        seller_wallet: "mock",
        artist_wallet: "mock",
        ledger_id: "mock",
        memo_id: "mock",
        meta_data: "mock",
        description: "mock",
        nft_title: "mock",
        photo_1: "mock",
        certificate_1: "mock",
        previous_owner_1: "mock",
        previous_owner_2: "mock",
        other_1: "mock"
    };

    try {
        let data = [];

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
        console.log("✅ New mock NFT added:", newNFT.nft_id);
    } catch (error) {
        console.error("❌ Error updating JSON:", error);
    }
}

// Run the function when script executes
addMockNFT();
