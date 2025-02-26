import { createPublicClient, http } from "viem";
import { localhost } from "viem/chains";

const run = async () => {
  // Define contract address
  const CONTRACT_ADDRESS = "0x0ac539fbFb7E6E4911de16FE81be9028C34ccb32";

  console.log(`🔍 Checking contract at: ${CONTRACT_ADDRESS}`);

  // Create a Viem public client for localhost
  const client = createPublicClient({
    chain: localhost,
    transport: http(),
  });

  try {
    // Fetch contract bytecode
    const bytecode = await client.getBytecode({ address: CONTRACT_ADDRESS });

    if (bytecode) {
      console.log(`✅ Contract is deployed at ${CONTRACT_ADDRESS}`);
    } else {
      console.log(`❌ No contract found at ${CONTRACT_ADDRESS}`);
    }
  } catch (error) {
    console.error("❌ Error fetching contract bytecode:", error);
  }
};

// Run the function
run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
