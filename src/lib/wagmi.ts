import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, sepolia, localhost } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { createPublicClient, createWalletClient } from "viem";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";

// ✅ Public client for reading blockchain state
export const publicClient = createPublicClient({
  chain: localhost,
  transport: http(),
});

// ✅ Wagmi config for connecting wallets
export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia, localhost],
    connectors: [
      injected(), // MetaMask or any browser-injected wallet
      coinbaseWallet(),
      walletConnect({ projectId: "be66693386aa799cb663f82644c71c85" }),
      // walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [localhost.id]: http(),
    },
  });
}

// ✅ Extend Wagmi module for TypeScript support
declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}