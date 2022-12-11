# Multi-sig Wallet Hardhat Project

This project demonstrates the followings:
1. Write a scalable multi-signature wallet contract, which requires a minimum of 60% authorization by the signatory wallets to perform a transaction.
2. Write an access registry contract that stores the signatories of this multi-sig wallet by address. This access registry contract will have its own admin. Further, the access registry contract must be capable of adding, revoking, renouncing, and transfer of signatory functionalities.

Smart Contracts:
1. AccessSpecifications.sol --> Access control specifications.
2. MultiSignatureWalletContract --> Transaction procedures and restrictions.
3. CommunicationInterface --> interface

Deployment:
1. scripts/deploy.js --> deployment of smart contract
2. Quicknode has been used (replace the node url in .env)
3. Metamask wallet has been used (replace the wallet/account private key in .env)

checkout "https://learnweb3.io/courses/9a3fafe4-b5eb-4329-bdef-97b2aa6aacc1/lessons/017e65bf-2a86-455e-a499-09b61ffa5241" to start 
deployment.

Deployed contract address:
Goerli Testnet Network --> 0xF65D645172439a0699276E7D5659b70e243DA7Fa

use Hardhat:
compile: npx hardhat compile
deploy: npx hardhat run scripts/deploy.js
