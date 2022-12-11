// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "contracts/AccessSpecifications.sol";
import "contracts/interfaces/CommunicationInterface.sol";


contract MultiSignatureWalletContract is AccessSpecifications {

  CommunicationInterface _communicationInterface;
  /*
  * @dev Transaction Reciept to store transaction information
  * @param execution_confirmation, sender_address, reciever_address, ether_amount_transacted, transaction_data
  */
  struct TransactionReciept {
    uint256 transactionId;
    address senderAddress;
    address recieverAddress;
    uint256 amountToTransfer;
    bool executionConfirmation;
    bytes transactionData;
  }

  /*
  * @dev Storage for transaction id, transactionId mapping to a transaction,
          storage for all true transactions, transactionId mapping with the senderaddress and conformation.
  * @param None
  */
  uint256 public transactionId;
  TransactionReciept[] public transactions;
  //mapping(uint256 => TransactionReciept) public transactionReciept;
  mapping(uint256 => mapping(address => bool)) public transactionConfirmedByAddress;

  /*
  * @dev Modifier to check transaction confirmation
  * @param Member address, transction id
  */
  modifier transactionNotConfirmed(uint256 _transactionId, address _memberAddress) {
    require(transactionConfirmedByAddress[_transactionId][_memberAddress] == false, "Transaction already Confirmed.");
    _;
  }

  /*
  * @dev Modifier to check transaction is confirmation
  * @param Member address, transction id
  */
  modifier transactionConfirmed(uint256 _transactionId, address _memberAddress) {
    require(transactionConfirmedByAddress[_transactionId][_memberAddress] == true, "Transaction not Confirmed.");
    _;
  }

  /*
  * @dev Modifier to confirm if transaction exists or not
  * @param Transaction id
  */
  modifier transactionExistance(uint256 _transactionId) {
    require(_transactionId < transactions.length, "Transaction doesnot exists.");
    _;
  }

  /*
  * @dev Modifier check for the transaction not execution
  * @param Transaction id
  */
  modifier transactionNotExecuted(uint256 _transactionId) {
    require(transactions[_transactionId].executionConfirmation == false, "Transaction already executed");
    _;
  }

  /*
  * @dev Constructor will try to set the very first set of owner members. Invoke Access specifications contract also.
  * @param Initial members address set, interface invocation, admin setter
  */
  constructor(
    CommunicationInterface _walletInterface,
    address[] memory _initialMemberAddressSet
    )
    AccessSpecifications(_initialMemberAddressSet)
  {
    _communicationInterface = CommunicationInterface(_walletInterface);
    presentAdmin = msg.sender;
    require(_initialMemberAddressSet.length > 3, "Minimum number of members not meet");
  }

  /*
  * @dev Fallback functions to reciever ethers.
  * @param None
  */
  fallback() external payable {
    require(msg.value > 0, "Amount must be greater than zero.");
    emit EtherDeposit(msg.sender, msg.value);
  }

  receive() external payable {
    require(msg.value > 0, "Amount must be greater than zero.");
    emit EtherDeposit(msg.sender, msg.value);
  }

  /*
  * @dev Helps in submitting a transaction
  * @param sender & reciever addresses, ether aount to be transfered, 
  */
  function trsnsactionSubmission(
    address _recieverAddress, 
    uint256 _amountToTransfer,
    bytes memory _transactionData)
    public
    holdingPresentOwnership(msg.sender)
  {
    transactionId = transactions.length;

    transactions.push(
      TransactionReciept({
        transactionId: transactionId,
        senderAddress: msg.sender,
        recieverAddress: _recieverAddress,
        amountToTransfer: _amountToTransfer,
        executionConfirmation: false,
        transactionData: _transactionData
      })
    );

    emit TransactionSubmission(
      transactionId,
      msg.sender,
      _recieverAddress,
      _amountToTransfer,
      false,
      _transactionData
    );
  }

  /*
  * @dev Function will confirm a transaction.
  * @param Transaction id
  */
  function transactionConfirmation(uint256 _transactionId)
    public
    holdingPresentOwnership(msg.sender)
    transactionExistance(_transactionId)
    notEmptyAddress(transactions[_transactionId].recieverAddress)
    transactionNotConfirmed(_transactionId, msg.sender)
    transactionNotExecuted(_transactionId)
  {
    transactionConfirmedByAddress[_transactionId][msg.sender] = true;

    emit TransactionConfirmation(
      msg.sender,
      transactions[_transactionId].recieverAddress,
      _transactionId
    );
  }

  /*
  * @dev Function will allow to execute a confirmed transaction
  * @param 
  */
  function transactionExcecution(uint256 _transactionId)
    public
    holdingPresentOwnership(msg.sender)
    transactionExistance(_transactionId)
    transactionNotExecuted(_transactionId)
  {
    uint confirmationCount;

    for (uint member = 0; member < presentOwnersAddress.length; member++) {
      if (transactionConfirmedByAddress[_transactionId][presentOwnersAddress[member]]) {
        confirmationCount += 1;
      }
    }

    require(confirmationCount >= authorizationPercentage, "Minimum authorization percentage not meet.");
    
    TransactionReciept storage recentTransaction = transactions[_transactionId];
    recentTransaction.executionConfirmation = true;

    (bool success, ) = recentTransaction.recieverAddress.call{value: recentTransaction.amountToTransfer}(recentTransaction.transactionData);

    if (success) {
      emit TransactionExecutionSuccess(_transactionId);
    } else {
      recentTransaction.executionConfirmation = false;
      emit TransactionExecutionFailure(_transactionId);
    }
  }

  /*
  * @dev Allowes to cancell confirmation
  * @param Transaction id of a confirmed transaction
  */
  function transactionCancelation(uint256 _transactionId)
    public
    holdingPresentOwnership(msg.sender)
    transactionExistance(_transactionId)
    transactionNotExecuted(_transactionId)
    transactionConfirmed(_transactionId, msg.sender)
  {
    transactionConfirmedByAddress[_transactionId][msg.sender] = false;
    emit TransactionCancellation(msg.sender, _transactionId);
  }

  /*
  * @dev Gives owners list
  * @param None
  */
  function getOwners() public view returns (address[] memory) {
        return presentOwnersAddress;
    }

  /*
  * @dev Gives totall number of transactions
  * @param None
  */
  function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

  /*
  * @dev Gives details of a particular transaction
  * @param Transaction id
  * @res Transaction sender & receiver address, transaction amount, transaction data, execution state 
  */
  function getTransaction(uint256 _transactionId)
    public
    view
    returns (
      uint256 transactionid,
      address senderAddress,
      address recieverAddress,
      uint256 amountTransfered,
      bool transactionExecutionState,
      bytes memory transactionData
    )
    {
        TransactionReciept storage transaction = transactions[_transactionId];

        return (
            transaction.transactionId,
            transaction.senderAddress,
            transaction.recieverAddress,
            transaction.amountToTransfer,
            transaction.executionConfirmation,
            transaction.transactionData
        );
    }

}
