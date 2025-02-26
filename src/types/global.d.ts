export {};

declare global {
  interface Window {
    gemWallet?: {
      getAddress: () => Promise<string>;
      isConnected: () => Promise<boolean>;
      sendPayment: (params: { amount: string; destination: string; network: string }) => Promise<{ hash: string }>;
    };
  }
}
