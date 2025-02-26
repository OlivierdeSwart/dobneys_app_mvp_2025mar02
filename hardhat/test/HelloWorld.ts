import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { getAddress } from "viem";

describe("HelloWorld Smart Contract", function () {
  // ✅ Deploy contract using a fixture
  async function deployHelloWorldFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const helloWorld = await hre.viem.deployContract("HelloWorld");

    const publicClient = await hre.viem.getPublicClient();

    return { helloWorld, owner, otherAccount, publicClient };
  }

  // ✅ Deployment Tests
  describe("Deployment", function () {
    it("Should set the default greeting", async function () {
      const { helloWorld } = await loadFixture(deployHelloWorldFixture);

      const result = await helloWorld.read.hello();
      expect(result).to.equal("Hello, World!");
    });
  });

  // ✅ Functionality Tests
  describe("Greeting Updates", function () {
    it("Should update the greeting", async function () {
      const { helloWorld, publicClient } = await loadFixture(deployHelloWorldFixture);

      // New greeting
      const newGreeting = "Hello, Viem!";

      // ✅ Send transaction
      const txHash = await helloWorld.write.changeGreeting([newGreeting]);

      // ✅ Wait for the transaction receipt correctly
      const receipt = await publicClient.getTransactionReceipt({ hash: txHash });

      // Ensure the transaction was successful
      expect(receipt).to.not.be.undefined;
      expect(receipt.status).to.equal("success");

      // ✅ Verify updated greeting
      const updatedGreeting = await helloWorld.read.hello();
      expect(updatedGreeting).to.equal(newGreeting);
    });

    // it("Should revert if called with an empty string", async function () {
    //   const { helloWorld } = await loadFixture(deployHelloWorldFixture);

    //   await expect(helloWorld.write.changeGreeting([""])).to.be.rejectedWith(
    //     "TransactionExecutionError"
    //   );
    });
  });

  // ✅ Permission Tests
//   describe("Permissions", function () {
//     it("Should allow only connected accounts to update greeting", async function () {
//       const { helloWorld, otherAccount, publicClient } = await loadFixture(deployHelloWorldFixture);

//       // Get contract instance with `otherAccount`
//       const helloWorldAsOther = await hre.viem.getContractAt(
//         "HelloWorld",
//         helloWorld.address,
//         { client: { wallet: otherAccount } }
//       );

//       // Transaction from another account
//       const txHash = await helloWorldAsOther.write.changeGreeting(["Unauthorized"]);

//       // ✅ Correctly wait for transaction receipt
//       const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
//       expect(receipt).to.not.be.undefined;
//       expect(receipt.status).to.equal("success");

//       // ✅ Verify new greeting
//       const updatedGreeting = await helloWorld.read.hello();
//       expect(updatedGreeting).to.equal("Unauthorized");
//     });
//   });

  // ✅ Event Tests
//   describe("Events", function () {
//     it("Should emit an event on greeting change", async function () {
//       const { helloWorld, publicClient } = await loadFixture(deployHelloWorldFixture);

//       const newGreeting = "Hello, Events!";

//       // ✅ Send transaction
//       const txHash = await helloWorld.write.changeGreeting([newGreeting]);

//       // ✅ Wait for transaction receipt
//       const receipt = await publicClient.getTransactionReceipt({ hash: txHash });

//       expect(receipt).to.not.be.undefined;
//       expect(receipt.status).to.equal("success");

//       // ✅ Check emitted event
//       const events = await helloWorld.getEvents.GreetingChanged();
//       expect(events).to.have.lengthOf(1);
//       expect(events[0].args.newGreeting).to.equal(newGreeting);
//     });
//   });
// })
;