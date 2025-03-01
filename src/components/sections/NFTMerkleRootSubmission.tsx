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
        const wallet = xrpl.Wallet.fromSeed("sEdSMWJBQpmN5zDrRnG4zoSEep3Thgt");

        // XRPL Client
        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();

        // Prepare the transaction
        const prepared = await client.autofill({
          TransactionType: "Payment",
          Account: wallet.address,
          Amount: "1", // 1 Drop (0.000001 XRP)
          Destination: "rJF9ntBXxcJLLMmkVPcFkjJFwcefKnpEv1",
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
        // if (tx.result.meta?.TransactionResult === "tesSUCCESS") {
        if ((tx.result.meta as xrpl.TransactionMetadata)?.TransactionResult === "tesSUCCESS") {
          setTxHash(signed.hash);
          setStatus("Transaction Successful ✅");
        } else {
          setStatus(`Transaction Failed ❌: ${tx.result.meta?.TransactionResult || "Unknown error"}`);
        }
      } catch (error) {
        setStatus(`Error: ${error}`);
      }
    };

    sendToXRPL();
  }, [formHash]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-blue-100 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">📜 Merkle Root Submission</h2>
      <p>Status: {status}</p>
      {txHash && (
        <p>
          <strong>Transaction Hash:</strong> {txHash}
        </p>
      )}
    </div>
  );
};

export default NFTMerkleRootSubmission;
