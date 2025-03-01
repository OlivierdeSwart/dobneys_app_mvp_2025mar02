"use client";

import { useEffect, useState } from "react";
import * as xrpl from "xrpl";

interface Props {
  formHash: string | null;
}

const NFTMerkleRootSubmission = ({ formHash }: Props) => {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Pending");

  useEffect(() => {
    if (!formHash) return;

    const sendToXRPL = async () => {
      try {
        setStatus("Processing...");

        // Wallet Credentials (Use ENV variables in production)
        const wallet = xrpl.Wallet.fromSeed("sEdV92U1nvfj6GEvJF7tKYS2tuGkrf7");

        // XRPL Client
        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();

        // Prepare the transaction
        const prepared = await client.autofill({
          TransactionType: "Payment",
          Account: wallet.address,
          Amount: "1", // 1 Drop (0.000001 XRP)
          Destination: "r4P6TraxPb3xDsSXiZv2Gx1GkKVDG1o46h",
          Memos: [
            {
              Memo: {
                MemoData: Buffer.from(formHash, "utf8").toString("hex"), // Convert hash to hex
              },
            },
          ],
        });

        // Sign the transaction
        const signed = wallet.sign(prepared);

        // Submit the transaction
        const tx = await client.submitAndWait(signed.tx_blob);

        // Disconnect client
        await client.disconnect();

        // Handle response safely
        if (typeof tx.result.meta === "object" && "TransactionResult" in tx.result.meta && tx.result.meta.TransactionResult === "tesSUCCESS") {
          setTxHash(signed.hash);
          setStatus("Transaction Successful ✅");
        } else {
          const transactionResult = typeof tx.result.meta === "object" && "TransactionResult" in tx.result.meta 
            ? tx.result.meta.TransactionResult 
            : "Unknown error";
          
          setStatus(`Transaction Failed ❌: ${transactionResult}`);
        }
      } catch (error) {
        setStatus(`Error: ${error}`);
      }
    };

    sendToXRPL();
  }, [formHash]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-blue-100 rounded-lg shadow-md text-center break-words">
      <h2 className="text-xl font-bold mb-4">📜 Merkle Root Submission</h2>
      <p className="break-words">Status: {status}</p>
      {txHash && (
        <p className="break-words">
          <strong>Transaction Hash:</strong>{' '}
          <a
            href={`https://testnet.xrpl.org/transactions/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {txHash}
          </a>
        </p>
      )}
    </div>
  );
};

export default NFTMerkleRootSubmission;
