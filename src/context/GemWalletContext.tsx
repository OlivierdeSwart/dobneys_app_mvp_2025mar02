// src/context/GemWalletContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { isInstalled, getAddress } from "@gemwallet/api";

interface GemWalletContextType {
  walletAddress: string | null;
  isWalletInstalled: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const GemWalletContext = createContext<GemWalletContextType | undefined>(undefined);

export const useGemWallet = () => {
  const context = useContext(GemWalletContext);
  if (!context) {
    throw new Error("useGemWallet must be used within a GemWalletProvider");
  }
  return context;
};

export const GemWalletProvider: React.FC = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);

  useEffect(() => {
    const checkWalletInstallation = async () => {
      const response = await isInstalled();
      setIsWalletInstalled(response.result.isInstalled);
    };
    checkWalletInstallation();
  }, []);

  const connectWallet = async () => {
    if (!isWalletInstalled) {
      alert("🚨 GemWallet is not installed.");
      return;
    }

    const response = await getAddress();
    if (response.type === "response" && response.result?.address) {
      setWalletAddress(response.result.address);
      console.log("✅ Connected to wallet:", response.result.address);
    } else {
      console.error("❌ Failed to retrieve wallet address.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    console.log("👋 Disconnected from wallet.");
  };

  return (
    <GemWalletContext.Provider
      value={{ walletAddress, isWalletInstalled, connectWallet, disconnectWallet }}
    >
      {children}
    </GemWalletContext.Provider>
  );
};
