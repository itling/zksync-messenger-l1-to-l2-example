# zkSync Messenger L1->L2 Example

> Send a message from L1 Goerli to L2 zkSync testnet.

## Example

There's two contracts; `L1Contract.sol` and `L2Contract.sol`

The L1 contract has a method `sendGreetingMessageToL2` that sends a message to L2 contract to set a greeting message on L2 contract.
It sends the encoded calldata to execute `setGreeting` on L2 which can only be called if the message was sent by the L1 contract.

### Files

- [`L2Contract.sol`](./contracts/L2Contract.sol)
- [`L1Contract.sol`](./contracts/L1Contract.sol)
- [`deployL1.js`](./scripts/deployL1.js)
- [`deployL2.js`](./deploy/deploy.js)
- [`sendL1ToL2Message.js`](./scripts/sendL1ToL2Message.js)
- [`getGreetingOnL2.js`](./scripts/getGreetingOnL2.js)

## Install

```sh
git clone https://github.com/itling/zksync-messenger-l1-to-l2-example.git
cd zksync-messenger-l1-to-l2-example
npm install
```

### Set Signer

Create `.env`

```sh
PRIVATE_KEY=123...
```

Make sure private key has funds on both zkSync testnet and Goerli.

### Compile Contracts

```sh
npx hardhat compile
```

### Deploy L1 Contract

Command

```sh
npx hardhat run --network goerli scripts/deployL1.js
```

Output

```sh
L1Contract was deployed to 0x9261058579A0b7F88fc4CA52f024Ee01e4D73fFa
```

### Deploy L2 Contract

Command

```sh
L1_CONTRACT=0x9261058579A0b7F88fc4CA52f024Ee01e4D73fFa \
npx hardhat deploy-zksync --network zksync
```

Output

```sh
L2Contract was deployed  to 0x3A98dbd8fA9825F168A1f0aF5Cb29fe38E9bAb57
```

### Send L1->L2 Message

Command (replace env vars with your values)


```sh
L1_CONTRACT=0x9261058579A0b7F88fc4CA52f024Ee01e4D73fFa \
L2_CONTRACT=0x3A98dbd8fA9825F168A1f0aF5Cb29fe38E9bAb57 \
npx hardhat run --network goerli scripts/sendL1ToL2Message.js
```

Output

```sh
L1 tx hash is >>  0x4ae983b6d07f208d006535583393423b26d2109e9dad0db57349278ed9b1223f
https://goerli.etherscan.io/tx/0x4ae983b6d07f208d006535583393423b26d2109e9dad0db57349278ed9b1223f
```


### Get Greeting on L2

Command

```sh
L2_CONTRACT=0x3A98dbd8fA9825F168A1f0aF5Cb29fe38E9bAb57 \
npx hardhat run --network zksync scripts/getGreetingOnL2.js
```

Output

```sh
greeting: Updated at Tue, 05 Sep 2023 14:05:33 GMT
```

### verify contract 
constract param is applyL1ToL2Alias address
```
npx hardhat verify  --network zksync 0x3A98dbd8fA9825F168A1f0aF5Cb29fe38E9bAb57 '0xa372058579a0b7f88fc4ca52f024ee01e4d7510b'
```

