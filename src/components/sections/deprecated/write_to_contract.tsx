"use client";

import { useState, useEffect } from "react";
import { Address } from "viem";
import { useAccount, useWriteContract, useChainId } from "wagmi";
import HelloWorldABI from "@/lib/abi/helloworld_abi.json";
import { localhost } from "viem/chains";


// ✅ Your smart contract address on localhost
const CONTRACT_ADDRESS: Address = "0x5b4aadfd9476c0716b6c9ce464a59c24d852f0ed";

export default function GreetingWriter() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();

    useEffect(() => {
    console.log("🔍 Wallet Debugging:");
    console.log("✅ Connected Address:", address);
    console.log("🔗 Wallet Chain ID:", chainId);
    }, [address, chainId]);

  const [newGreeting, setNewGreeting] = useState("");
//   const { address, isConnected } = useAccount(); // Get user's connected wallet
  const { writeContractAsync, isPending, error } = useWriteContract(); // Function to send tx

  // ✅ Function to update greeting
  async function updateGreeting() {
    if (!newGreeting.trim()) {
      alert("Please enter a new greeting!");
      return;
    }
    if (!isConnected || !address) {
      alert("Please connect your wallet!");
      return;
    }

    try {
      // ✅ Send transaction to contract
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: HelloWorldABI.abi,
        functionName: "changeGreeting",
        args: [newGreeting], // Pass new greeting as argument
        chainId: localhost.id, // Use Hardhat's localhost chain
      });

      console.log("📜 Transaction sent:", hash);
      alert("Greeting updated successfully!");

      setNewGreeting(""); // Clear input field
    } catch (error) {
      console.error("❌ Error updating greeting:", error);
      alert("Failed to update greeting!");
    }
  }

  return (
    <div>
      <h3>✏️ Update Greeting</h3>
      <input
        type="text"
        placeholder="Enter new greeting"
        value={newGreeting}
        onChange={(e) => setNewGreeting(e.target.value)}
        disabled={isPending} // Disable input during tx
      />
      <button onClick={updateGreeting} disabled={!isConnected || isPending}>
        {isPending ? "Updating..." : "Change Greeting"}
      </button>

      {!isConnected && <p>⚠️ Please connect your wallet to update the greeting.</p>}
      {error && <p className="error">❌ Error: {error.message}</p>}
    </div>
  );
}
