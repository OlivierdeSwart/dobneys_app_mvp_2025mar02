"use client";

import React, { useState, useEffect } from "react";
import { isInstalled, getAddress } from "@gemwallet/api";

const LoginButton = () => {
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkWalletInstallation = async () => {
      const response = await isInstalled();
      setIsWalletInstalled(response.result.isInstalled);
    };

    checkWalletInstallation();
  }, []);

  const handleLogin = async () => {
    if (!isWalletInstalled) {
      alert("🚨 GemWallet is not installed. Please install it to continue.");
      return;
    }

    const response = await getAddress();

    if (response.type === "response" && response.result?.address) {
      setWalletAddress(response.result.address);
      console.log(`✅ Connected Wallet: ${response.result.address}`);
    } else {
      console.error("❌ Failed to retrieve wallet address.");
    }
  };

  const handleLogout = () => {
    setWalletAddress(null);
    console.log("👋 Disconnected from wallet.");
  };

  return (
    <div className="relative">
      {walletAddress ? (
        <div className="flex items-center gap-3 border border-gray-300 bg-white px-4 py-2 rounded-lg shadow-md">
          <div className="text-sm">
            <p className="font-semibold">✅ Connected</p>
            <p className="text-gray-600">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-3 text-red-600 text-xs font-bold hover:underline"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Login to Wallet
        </button>
      )}
    </div>
  );
};

export default LoginButton;
