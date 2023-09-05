const { Wallet, utils } = require('zksync-web3')
const { Deployer } = require('@matterlabs/hardhat-zksync-deploy')
require('dotenv').config()

async function main(hre) {
  if (!hre) {
    return
  }

  const l1ContractAddress = process.env.L1_CONTRACT
  const wallet = new Wallet(process.env.PRIVATE_KEY)
  const deployer = new Deployer(hre, wallet)
  const artifact = await deployer.loadArtifact('L2Contract')

  // // Deposit some funds to L2 to be able to perform deposits.
  // const deploymentFee = await deployer.estimateDeployFee(artifact, [
  //   utils.applyL1ToL2Alias(l1ContractAddress),
  // ]);
  // const depositHandle = await deployer.zkWallet.deposit({
  //   to: deployer.zkWallet.address,
  //   token: utils.ETH_ADDRESS,
  //   amount: deploymentFee.mul(2),
  // });
  // // Wait until the deposit is processed on zkSync
  // await depositHandle.wait();

  const l2Contract = await deployer.deploy(artifact, [
    utils.applyL1ToL2Alias(l1ContractAddress),
  ]);

  // Show the contract info.
  const contractAddress = l2Contract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

module.exports = main
