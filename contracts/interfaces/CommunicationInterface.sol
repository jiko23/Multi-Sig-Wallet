// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface CommunicationInterface {

  /*
  * @dev Adds new owner to wallet
  * @param Address of the new owner
  */
  function addNewOwnerToWallet(address _newJoinee) external;

  /*
  * @dev Removes an owner from wallet
  * @param Address of the owner to be removed from wallet
  */
  function removeOwnerFromWallet(address _memberAddress) external;

  /*
  * @dev Admin can transfer ownership to a new owner
  * @param Address of present owner and address of new owner
  */
  function adminOwnershipTransfer(address _presentAdmin, address _newAdmin) external;

  /*
  * @dev To confirm a transaction
  * @param Transaction Id of a transaction
  */
  function transactionConfirmation(uint256 _transactionId) external;

  /*
  * @dev Excecution of a confirmed transaction
  * @param Transaction Id of the confirmed transaction
  */
  function transactionExcecution(uint256 _transactionId) external;

  /*
  * @dev Official cancalation of a transaction
  * @param Transaction Id of the transaction to be cancelled officially
  */
  function transactionCancelation(address _transactionId) external;
}