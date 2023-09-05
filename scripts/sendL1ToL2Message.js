const { BigNumber,Contract,ethers ,Wallet} = require('ethers')
const {  Provider, utils } = require('zksync-web3')

require('dotenv').config()

async function main() {
  const privateKey = process.env.PRIVATE_KEY
  const l1ContractAddress = process.env.L1_CONTRACT
  const l2ContractAddress = process.env.L2_CONTRACT

  const l2Provider = new Provider('https://testnet.era.zksync.dev')
  const l1Provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')
  const wallet = new ethers.Wallet(privateKey, l1Provider);
  const zkSyncAddress = await l2Provider.getMainContractAddress()
  console.log('L2 main contract address is ',zkSyncAddress)
  const zkSyncContract = new Contract(
    zkSyncAddress,
    utils.ZKSYNC_MAIN_ABI,
    wallet,
  );
  const balanceL1=await wallet.getBalance();
  console.log(`L1 Balance is ${ethers.utils.formatEther(balanceL1.toHexString())}`);

  const balanceL2=await new ethers.Wallet(privateKey, l2Provider).getBalance();
  console.log(`L2 Balance is ${ethers.utils.formatEther(balanceL2.toHexString())}`);

  const l1ContractAbi = require('../artifacts-zk/contracts/L1Contract.sol/L1Contract.json').abi
  const l1Contract = new Contract(l1ContractAddress, l1ContractAbi, wallet);

  const l2ContractAbi = require('../artifacts-zk/contracts/L2Contract.sol/L2Contract.json').abi
  const l2Contract = new Contract(l2ContractAddress, l2ContractAbi, l2Provider);

  const message = `Updated at ${new Date().toUTCString()}`;

  const iface = new ethers.utils.Interface(l2ContractAbi);
  const calldata = iface.encodeFunctionData("setGreeting", [message]);

  const l1GasPrice = await l1Provider.getGasPrice()
  console.log(`L1 gasPrice ${ethers.utils.formatEther(l1GasPrice)} ETH`);


  const l2GasLimit = await l2Provider.estimateL1ToL2Execute({
    contractAddress: l2ContractAddress,
    calldata: calldata,
    caller: utils.applyL1ToL2Alias(l1ContractAddress),
  });

  console.log(`l1ContractAddress applyL1ToL2Alias is ${utils.applyL1ToL2Alias(l1ContractAddress)}`);

  console.log(`L2 gasLimit ${l2GasLimit.toString()}`);

  const baseCost = await zkSyncContract.l2TransactionBaseCost(
    l1GasPrice,
    l2GasLimit,
    utils.REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
  );
  
  console.log(`Executing this transaction will cost ${ethers.utils.formatEther(baseCost)} ETH`);

  console.log(`Message in contract is ${await l2Contract.greeting()}`);
  const tx = await l1Contract.sendGreetingMessageToL2(
    zkSyncAddress,
    l2ContractAddress,
    calldata,
    l2GasLimit,
    utils.REQUIRED_L1_TO_L2_GAS_PER_PUBDATA_LIMIT,
    {
      value: baseCost,
      gasPrice:l1GasPrice,
    })

  console.log("L1 tx ", tx);
  console.log("L1 tx hash is >> ", tx.hash);

  tx.wait();

  console.log(`https://goerli.etherscan.io/tx/${tx.hash}`)

  console.log('Waiting for L2 block inclusion (this may take up 5 minutes)...')

  // Get the TransactionResponse object for the L2 transaction corresponding to the execution call.
  const l2Response = await l2Provider.getL2TransactionFromPriorityOp(tx);
  // Output the receipt of the L2 transaction corresponding to the call to the counter contract.
  const l2Receipt = await l2Response.wait();
  console.log("L2 tx hash is >> ", l2Receipt.transactionHash);
  console.log(`https://goerli.explorer.zksync.io/tx/${l2Receipt.transactionHash}`)

  console.log(`Message in contract is ${await l2Contract.greeting()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
