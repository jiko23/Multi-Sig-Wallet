// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract AccessSpecifications {

  using SafeMath for uint256;

  /*
  * @dev Informations reagarding the current states of the contract
  * @param Events
  */
    /*
  * @dev Informs regarding transaction submission.
  * @param Transaction Id of the transaction to submit
  * @param Sender address
  * @param Reciever address i.e. destination address
  * @param Transaction amount
  * @param Transaction execution confirmation by address, either true/false
  * @param Transaction data
  */
  event TransactionSubmission(
    uint256 _transactionId,
    address indexed _senderAddress,
    address indexed _recieverAddress,
    uint256 _amountToTransfer,
    bool _executionConfirmation,
    bytes _transactionData
  );
  
    /*
  * @dev Informs regarding confirmation of the submitted transaction.
  * @param Sender's address, receiver address, transaction id.
  */
  event TransactionConfirmation(
    address indexed _senderAddress, 
    address indexed _reciverAddress,
    uint256 _transactionId
  );
  
    /*
  * @dev Informs regarding execution of a transaction.
  * @param Transaction id.
  */
  event TransactionExecutionSuccess(uint256 _transactionId);
  
    /*
  * @dev Informs regarding failure of a transaction execution.
  * @param Transaction id.
  */
  event TransactionExecutionFailure(uint256 _transactionId);
  
    /*
  * @dev Informs regarding official cancellation of a transaction.
  * @param Sender's address and transaction id to be cancelled.
  */
  event TransactionCancellation(address indexed _senderAddress, uint256 _transactionId);
  
    /*
  * @dev Informs regarding new owner addition.
  * @param New owner address.
  */
  event OwnerNewJoinie(address indexed _newJoinieAddress);
  
    /*
  * @dev Informs regarding removal of an existing owner.
  * @param Address of the owner to be removed.
  */
  event RemovedOwner(address indexed _ownerAddress);
  
    /*
  * @dev Informs regarding transfer of admin power.
  * @param Address of the new admin.
  */
  event AdminPowerTransfered(address indexed _pastAdmin, address indexed _newAdmin);
  
      /*
  * @dev Informs regarding transfer of admin power.
  * @param Address of the new admin.
  */
  event OwnershipTransfered(address indexed _pastOwner, address indexed _newOwner);
  
    /*
  * @dev Informs regarding minimum authorization percent to conduct a transaction.
  * @param minimum authorization percent.
  */
  event MinimumAuthorizationPercentage(uint256 _authorizationPercent);
  
    /*
  * @dev Informs regarding ether deposits.
  * @param Sender's address and amount sent.
  */
  event EtherDeposit(address indexed _senderAddress, uint256 _etherAmount);


  /*
  * Variable to store address of the present admin.
  * Dynamic array to store address of present owners
  * A mapping of address of owner and the state of ownership i.e. true/false.
  * Variable to store the minimum authorization percentage for a transaction by a owner
  */
  address public presentAdmin;
  address[] public presentOwnersAddress;
  mapping (address => bool) public confirmOwner;
  uint256 public authorizationPercentage;


  /*
  * @dev Modifies a function to be only access by authorized admin.
  * @param None
  */
  modifier authorizedAdmin() {
    require(msg.sender == presentAdmin, "Only authorized admin can access this function.");
    _;
  }

  /*
  * @dev Modifies a function to be only access only if the address not already present in owners   list.
  * @param Address of the new member 
  */
  modifier ownerNotPresentAlready(address _newJoinee) {
    require(confirmOwner[_newJoinee] == false, "Address already present in owners list.");
    _;
  }

  /*
  * @dev Confirms if address is a present owner or not.
  * @param Address of the member
  */
  modifier holdingPresentOwnership(address _memberAddress) {
    require(confirmOwner[_memberAddress] == true, "Address not among present owners.");
    _;
  }

  /*
  * @dev Modifies checks if the address is empty or null
  * @param Address of the new member 
  */
  modifier notEmptyAddress(address _newJoinee) {
    require(_newJoinee != address(0), "Empty address or address not exists.");
    _;
  }

  
  /*
  * @dev Constructor will be used to set an owners, set authorization percent, admin.
  * @param Address of set of owner.
  */
  constructor(address[] memory _ownersArray) {
    // Setting msg.sender as present authorized admin
    presentAdmin = msg.sender;

    // Requires atleast 2 owners at starting.
    require(_ownersArray.length >= 3, "Require atleast 2 owners in beginning.");

    // Mappig owners from the array as true owners.
    for (uint owner = 0; owner < _ownersArray.length; owner++) {
      confirmOwner[_ownersArray[owner]] = true;
    }

    // Setting present owners address
    presentOwnersAddress = _ownersArray;

    // Setting minimum authorization percentage i.e 60%
    authorizationPercentage = SafeMath.div(SafeMath.mul(_ownersArray.length, 60), 100);
  }


  /*
  Implement access specific functions from interface i.e. CommunicationInterface
  */
  /*
  * @dev Adds new owner to wallet
  * @param Address of the new owner
  */
  function addNewOwnerToWallet(address _newJoinee) public
    authorizedAdmin
    ownerNotPresentAlready(_newJoinee)
    notEmptyAddress(_newJoinee)
  {
    confirmOwner[_newJoinee] = true;
    presentOwnersAddress.push(_newJoinee);

    reCalculateAuthorizationPercentage(presentOwnersAddress);
    emit OwnerNewJoinie(_newJoinee);
  }

 /*
  * @dev Removes an owner from wallet
  * @param Address of the owner to be removed from wallet
  */
  function removeOwnerFromWallet(address _memberAddress) public 
    authorizedAdmin
    holdingPresentOwnership(_memberAddress)
    notEmptyAddress(_memberAddress)
  {
    confirmOwner[_memberAddress] = false;

    for (uint owner = 0; owner < presentOwnersAddress.length - 1; owner++) {
      if (presentOwnersAddress[owner] == _memberAddress) {
        presentOwnersAddress[owner] = presentOwnersAddress[presentOwnersAddress.length - 1];
        break;
      }
    }
    presentOwnersAddress.pop();
    reCalculateAuthorizationPercentage(presentOwnersAddress);

    emit RemovedOwner(_memberAddress);
  }
  
/*
  * @dev Admin can transfer ownership to a new owner
  * @param Address of present owner and address of new owner
  */
  function ownershipTransfer(address _presentOwner, address _newOwner) public
    authorizedAdmin
    holdingPresentOwnership(_presentOwner)
    ownerNotPresentAlready(_newOwner)
    notEmptyAddress(_newOwner)
    notEmptyAddress(_presentOwner)
  {
    for (uint owner = 0; owner < presentOwnersAddress.length; owner++) {
      if (presentOwnersAddress[owner] == _presentOwner) {
        presentOwnersAddress[owner] = _newOwner;
      }
    }
    confirmOwner[_presentOwner] = false;
    confirmOwner[_newOwner] = true;

    emit RemovedOwner(_presentOwner);
    emit OwnerNewJoinie(_newOwner);
    emit OwnershipTransfered(_presentOwner, _newOwner);
  }

 /*
  * @dev Admin can transfer ownership to a new owner
  * @param Address of present owner and address of new owner
  */
  function adminOwnershipTransfer(address _presentAdmin, address _newAdmin) public
    authorizedAdmin
  {
    presentAdmin = _newAdmin;

    emit AdminPowerTransfered(_presentAdmin, _newAdmin);
  }

  /*
  * @dev Calculates minimum authorization percentage for a transaction.
  * @param None
  * @desc This cannot be inherited. Only can be used internally.
  */
  function reCalculateAuthorizationPercentage(address[] memory _ownersArray) internal
  {
    authorizationPercentage = SafeMath.div(SafeMath.mul(_ownersArray.length, 60), 100);

    emit MinimumAuthorizationPercentage(authorizationPercentage);
  }
  
}