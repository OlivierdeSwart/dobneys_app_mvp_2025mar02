"use client";

import { useEffect, useState } from "react";
import { isInstalled, getAddress } from "@gemwallet/api";

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if GemWallet is installed
    isInstalled().then((response) => {
      setIsWalletInstalled(response.result.isInstalled);
      if (!response.result.isInstalled) {
        console.log("❌ GemWallet not found. Make sure the extension is installed.");
      } else {
        console.log("✅ GemWallet is installed.");
      }
    });
  }, []);

  // // Function to connect to GemWallet
  // const handleConnect = async () => {
  //   if (!isWalletInstalled) {
  //     alert("GemWallet not detected. Please install it first.");
  //     return;
  //   }

  //   const response = await getAddress();
  //   if (response.result?.address) {
  //     setWalletAddress(response.result.address);
  //     console.log(`✅ Connected Wallet: ${response.result.address}`);
  //   } else {
  //     console.log("❌ Failed to get wallet address.");
  //   }
  // };

  return (
    <main className="text-center p-10">
      <h1 className="text-3xl font-bold">XRPL NFT Marketplace Homepage</h1>

      <div className="mt-6">
        {isWalletInstalled === null ? (
          <p>Checking for GemWallet...</p>
        ) : isWalletInstalled ? (
          <p className="text-green-600">✅ GemWallet is installed!</p>
        ) : (
          <p className="text-red-600">❌ GemWallet not found. Install it <a href="https://gemwallet.app/" target="_blank" className="underline text-blue-600">here</a>.</p>
        )}
      </div>

      {/* <button
        onClick={handleConnect}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : "Login to Wallet"}
      </button> */}
      <p>
        Please use "Login to Wallet" in the top right corner
      </p>
    </main>
  );
}
