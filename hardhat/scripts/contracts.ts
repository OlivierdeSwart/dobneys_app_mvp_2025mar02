import hre from "hardhat";

async function main() {
  const myToken = await hre.viem.deployContract("MyToken", [1_000_000n]);

  const initialSupply = await myToken.read.getCurrentSupply();
  console.log(`Initial supply of MyToken: ${initialSupply}`);

  const hash = await myToken.write.increaseSupply([500_000n]);
  // increaseSupply sends a tx, so we need to wait for it to be mined
  const publicClient = await hre.viem.getPublicClient();
  await publicClient.waitForTransactionReceipt({ hash });

  const newSupply = await myToken.read.getCurrentSupply();
  console.log(`New supply of MyToken: ${newSupply}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  