"use client";

import { useEffect, useState, useCallback } from "react";
import { publicClient } from "@/lib/wagmi"; // Ensure this is properly created
import HelloWorldJSON from "@/lib/abi/helloworld_abi.json"; // ✅ Import full artifact JSON
import { Address } from "viem";

// ✅ Extract ABI safely
const { abi } = HelloWorldJSON;

// ✅ Define contract address safely
const CONTRACT_ADDRESS = "0x5b4aadfd9476c0716b6c9ce464a59c24d852f0ed" as Address;

function GreetingReader() {
  let [greeting, setGreeting] = useState<string | null>("Loading...");
  const [isLoading, setIsLoading] = useState<boolean>(false); // ✅ Loading state

  // ✅ Function to fetch the greeting from the contract
  const fetchGreeting = useCallback(async () => {
    setIsLoading(true); // Show loading state
    try {
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi, // ✅ Use extracted ABI
        functionName: "hello",
      });

      setGreeting(result as string);
    } catch (error) {
      console.error("Error reading contract:", error);
      setGreeting("❌ Error fetching greeting");
    }
    setIsLoading(false); // Hide loading state
  }, []);

  // ✅ Fetch greeting on mount
  useEffect(() => {
    fetchGreeting();
  }, [fetchGreeting]);

  return (
    <div>
      <h2>🔍 Reading from SC address:</h2>
      <p>
        <strong>{CONTRACT_ADDRESS}</strong>
      </p>
      <p>📜 Current greeting: {greeting}</p>

      {/* ✅ Re-read button */}
      <button onClick={fetchGreeting} disabled={isLoading} style={{ marginTop: "10px" }}>
        {isLoading ? "⏳ Fetching..." : "🔄 Re-read Greeting"}
      </button>
    </div>
  );
}

export default GreetingReader;
