import { createWalletClient, createPublicClient, http } from "viem";
import { localhost } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import HelloWorldJSON from "../artifacts/contracts/HelloWorld.sol/HelloWorld.json"; // ✅ Import compiled JSON
import dotenv from "dotenv";

dotenv.config();

// ✅ Load private key safely
const privateKeyRaw = process.env.PRIVATE_KEY;
if (!privateKeyRaw) {
  throw new Error("❌ PRIVATE_KEY is missing from .env");
}

// ✅ Ensure private key is prefixed with `0x`
const privateKey = privateKeyRaw.startsWith("0x")
  ? (privateKeyRaw as `0x${string}`)
  : (`0x${privateKeyRaw}` as `0x${string}`);

// ✅ Convert private key to Viem-compatible account
const account = privateKeyToAccount(privateKey);

// ✅ Create a wallet client for signing transactions
const walletClient = createWalletClient({
  account,
  chain: localhost,
  transport: http(),
});

// ✅ Create a public client for reading blockchain state
const publicClient = createPublicClient({
  chain: localhost,
  transport: http(),
});

async function main() {
  console.log("🚀 Deploying HelloWorld contract...");

  // ✅ Extract ABI and Bytecode
  const { abi, bytecode } = HelloWorldJSON;

  // ✅ Ensure bytecode is prefixed correctly
  const formattedBytecode = bytecode.startsWith("0x")
    ? (bytecode as `0x${string}`)
    : (`0x${bytecode}` as `0x${string}`);

  // ✅ Deploy contract using Viem's walletClient
  const hash = await walletClient.deployContract({
    abi,
    bytecode: formattedBytecode,
  });

  console.log("⏳ Waiting for deployment confirmation...");

  // ✅ Get deployed contract address
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const contractAddress = receipt.contractAddress;

  console.log(`✅ Contract deployed at: ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
  