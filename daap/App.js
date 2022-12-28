import React, { Component } from "react";
import { abi, Contract_ADDRESS, WSS_URL } from './config'

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData()
  }

  getProvider() {
    var Web3 = require('web3');
    //const web3Provider = new Web3.providers.HttpProvider(NODE_URL); //only for http provider
    const web3Provider = new Web3.providers.WebsocketProvider(WSS_URL);
    const web3 = new Web3(web3Provider);
    return web3;
  }

  async loadBlockchainData() {
    const web3 = this.getProvider();

    await web3.eth.getBlockNumber().then( (blockNum) => {
      this.setState({ethinfo: {chainblock: blockNum}});
    });

    await web3.eth.net.getId().then( (netNum) => {
      this.setState({ethinfo: {network: netNum}});
    });
    this.authorizedOwners(web3);
  }

  authorizedOwners(web3){
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);

    contract.methods.getOwners().call().then( (result) => {
      if(result.length === 0) {
        window.alert("Not meeting owner numbers");
        throw new Error("Numbers of initial owners not meet...");
      }
      let temp = this.state.owners.slice();

      for(let i = 0; i < result.length; i++) {
        temp[i] = result[i];
      }
      this.setState({owners: temp});
    });
  }

  getRequiredGasFee(transactionData, senderAddr, web3) {
    const gasPrice = new Promise(function(resolve, reject) {
      let gp = web3.eth.getGasPrice();
      if(gp !== 0) {
        setTimeout(resolve, gp);
      } else {
        reject('failed');
      }
    });
  
    const gasAmount = new Promise(function(resolve, reject) {
      let ga = transactionData.estimateGas({from: senderAddr});
      if(ga !== 0) {
        setTimeout(resolve, ga);
      } else {
        reject('failed');
      }
    });

    try {
      let result = Promise.all([gasPrice, gasAmount]);
      result.then(function(values) {
        let gasFee = values[0] * values[1];
        console.log("required gas fee: ", gasFee);
        window.alert("Required Gas Fee: " + gasFee);
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async submitTransaction() {
    const web3 = this.getProvider();
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);
    const transactionData = contract.methods.trsnsactionSubmission(
      this.state.reciepts.transaction.recieverAddress,
      web3.utils.toWei(String(this.state.reciepts.transaction.amount), 'ether'),
      web3.utils.asciiToHex(this.state.reciepts.transaction.message)
    );

    this.getRequiredGasFee(transactionData, this.state.reciepts.transaction.senderWalletAddr, web3);

    try {
      const transactionForm = await web3.eth.accounts.signTransaction(
        {
           from: this.state.reciepts.transaction.senderWalletAddr,
           to: Contract_ADDRESS,
           data: transactionData.encodeABI(),
           gas: this.state.reciepts.transaction.gasFee,
        },
        this.state.reciepts.transaction.walletPrivateKey
      );
      const transactionReceipt = await web3.eth.sendSignedTransaction(transactionForm.rawTransaction);

      //Event TransactionSubmission
      contract.events.TransactionSubmission({fromBlock: this.state.ethinfo.chainblock}, function(error, event) {
        if (error) {
          alert("submission failed!!!");
        } else {
          console.log(event);
        }
      }).on('event', function(event) {
        console.log("on submission: ", event);
      }).on('error', function(error) {
        window.alert('Could not add address');
        throw new Error(error);
      });

      window.alert("Transaction Submitted....");
      this.downloadReciept(transactionReceipt);
    } catch (err) {
      throw new Error(err);
    }
  }

  showTransaction() {
    const web3 = this.getProvider();
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);
    try {
      contract.methods.getTransaction(this.state.getTransID).call().then( (result) => {
        this.downloadReciept(result);
      });
    } catch (err) {
      console.Error(err);
    }
  }

  async confirmTransaction() {
    const web3 = this.getProvider();
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);
    const transactionData = contract.methods.transactionConfirmation(this.state.transactionConfirmOrCancel.transId);

    try {
      this.getRequiredGasFee(transactionData, this.state.transactionConfirmOrCancel.confirmrequestSender, web3);
      const transactionForm = await web3.eth.accounts.signTransaction({
        from: this.state.transactionConfirmOrCancel.confirmrequestSender,
        to: Contract_ADDRESS,
        data: transactionData.encodeABI(),
        gas: this.state.transactionConfirmOrCancel.confirmrequestGassFee
      },
      this.state.transactionConfirmOrCancel.confirmrequestSenderPrivateKey
      );

      const transReciept = await web3.eth.sendSignedTransaction(transactionForm.rawTransaction);

      //event TransactionConfirmation
      contract.events.TransactionConfirmation({fromBlock: this.state.ethinfo.chainblock}, function(error, event) {
        if (error) {
          console.Error(error);
        } else {
          console.log(event);
        }
      }).on('event', function(event) {
        console.log(event);
      }).on('error', function(error) {
        throw new Error(error);
      });

      window.alert("confirmed this transaction!!!!");
      this.downloadReciept(transReciept);
    } catch (err) {
      throw new Error(err);
    }
  }

  async cancelTransaction() {
    const web3 = this.getProvider();
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);
    const transactionData = contract.methods.transactionCancelation(this.state.transactionConfirmOrCancel.transId);

    try {
      this.getRequiredGasFee(transactionData, this.state.transactionConfirmOrCancel.confirmrequestSender, web3);
      const transactionForm = await web3.eth.accounts.signTransaction({
        from: this.state.transactionConfirmOrCancel.confirmrequestSender,
        to: Contract_ADDRESS,
        data: transactionData.encodeABI(),
        gas: this.state.transactionConfirmOrCancel.confirmrequestGassFee
      },
      this.state.transactionConfirmOrCancel.confirmrequestSenderPrivateKey
      );

      const transReciept = await web3.eth.sendSignedTransaction(transactionForm.rawTransaction);

      //event TransactionConfirmation
      contract.events.TransactionCancellation({fromBlock: this.state.ethinfo.chainblock}, function(error, event) {
        if (error) {
          console.Error(error);
        } else {
          console.log(event);
        }
      }).on('event', function(event) {
        console.log(event);
      }).on('error', function(error) {
        throw new Error(error);
      });

      window.alert("cancelled this transaction!!!!");
      this.downloadReciept(transReciept);
    } catch (err) {
      throw new Error(err);
    }
  }

  async executeTransaction() {
    const web3 = this.getProvider();
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);
    const transactionData = contract.methods.transactionExcecution(this.state.transExecute.executetransId);

    try {
      this.getRequiredGasFee(transactionData, this.state.transExecute.sender, web3);
      const transactionForm = await web3.eth.accounts.signTransaction({
        from: this.state.transExecute.executeRequestsender,
        to: Contract_ADDRESS,
        data: transactionData.encodeABI(),
        gas: this.state.transExecute.executeGasfee
      },
      this.state.transExecute.executeSenderPrivateKey
      );

      const transReciept = await web3.eth.sendSignedTransaction(transactionForm.rawTransaction);

      contract.events.TransactionExecutionSuccess({fromBlock: this.state.ethinfo.chainblock}, function(error, event) {
        if (error) {
          console.Error(error);
        } else {
          console.log(event);
        }
      }).on('event', function(event) {
        console.log(event);
      }).on('error', function(error) {
        throw new Error(error);
      });

      window.alert("Execution successfull!!!");
      this.downloadReciept(transReciept);
    } catch (err) {
      contract.events.TransactionExecutionFailure({fromBlock: this.state.ethinfo.chainblock}, function(error) {
        window.alert(error);
      }).on('error', function(error) {
        throw new Error(error);
      });
    }
  }

  async addAddressToOwners() {
    const web3 = this.getProvider();
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);
    const transactionData = contract.methods.addNewOwnerToWallet(this.state.reciepts.newOwner.addresstoAdd);

    try {
      this.getRequiredGasFee(transactionData, this.state.reciepts.newOwner.senderAddr, web3);
      const transactionForm = await web3.eth.accounts.signTransaction(
        {
           from: this.state.reciepts.newOwner.senderAddr,
           to: Contract_ADDRESS,
           data: transactionData.encodeABI(),
           gas: this.state.reciepts.newOwner.gas,
        },
        this.state.reciepts.newOwner.privateKey
      );
      const transReciept = await web3.eth.sendSignedTransaction(transactionForm.rawTransaction);

      //event OwnerNewJoinie
      contract.events.OwnerNewJoinie({fromBlock: this.state.ethinfo.chainblock}, function(error, event) {
        if (error) {
          console.Error(error);
        } else {
          console.log(event);
        }
      }).on('event', function(event) {
        console.log("owner added: ", event);
      }).on('error', function(error) {
        window.alert('Could not add address');
        throw new Error(error);
      });

      alert(this.state.reciepts.newOwner.addresstoAdd + " added to Owners!!");
      this.downloadReciept(transReciept.logs);
    } catch (err) {
      throw new Error(err);
    }
  }

  async ownerToRemove() {
    const web3 = this.getProvider();
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);
    const transactionData = contract.methods.removeOwnerFromWallet(this.state.reciepts.ownerRemove.addresstoRemove);

    try {
      this.getRequiredGasFee(transactionData, this.state.reciepts.ownerRemove.removeRequestsenderAddr, web3);

      const transactionForm = await web3.eth.accounts.signTransaction(
        {
           from: this.state.reciepts.ownerRemove.removeRequestsenderAddr,
           to: Contract_ADDRESS,
           data: transactionData.encodeABI(),
           gas: this.state.reciepts.ownerRemove.removeRequestGas
        },
        this.state.reciepts.ownerRemove.removeRequestPrivateKey
      );
      const ownerRemoveReciept = await web3.eth.sendSignedTransaction(transactionForm.rawTransaction);

      contract.events.RemovedOwner({fromBlock: this.state.ethinfo.chainblock}, function(error, event) {
        if (error) {
          console.Error(error);
        } else {
          console.log(event);
        }
      }).on('event', function(event) {
        console.log(event);
      }).on('error', function(error) {
        throw new Error(error);
      });

      window.alert(this.state.reciepts.ownerRemove.addresstoRemove + " removed!!!");
      console.log("Reciept: ", ownerRemoveReciept.logs);
      this.downloadReciept(ownerRemoveReciept.logs);
    } catch (err) {
      alert("Owner not removed");
      console.log(err);
    }
  }

  async transferOwnerShip() {
    const web3 = this.getProvider();
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);

    const admin = contract.methods.presentAdmin.call();
    console.log("Present admin: ", admin);
    const transactionData = contract.methods.ownershipTransfer(
      this.state.reciepts.trasnferOwner.presentOwner,
      this.state.reciepts.trasnferOwner.transferToAddr
      );

    try {
      this.getRequiredGasFee(transactionData, this.state.reciepts.trasnferOwner.requestAddr, web3);

      const transactionForm = await web3.eth.accounts.signTransaction(
        {
           from: this.state.reciepts.trasnferOwner.requestAddr,
           to: Contract_ADDRESS,
           data: transactionData.encodeABI(),
           gas: this.state.reciepts.trasnferOwner.requestGas
        },
        this.state.reciepts.trasnferOwner.requestPrivateKey
      );
      const transReciept = await web3.eth.sendSignedTransaction(transactionForm.rawTransaction);
      //console.log(transReciept);

      //Events: RemovedOwner, OwnerNewJoinie, OwnershipTransfered
      contract.once('RemovedOwner', {fromBlock: 'latest'}, function(error, event) {
        if (error) {
          console.Error(error);
        } else {
          console.log("owner removed: ", event);
        }
      });

      contract.once('OwnerNewJoinie', {fromBlock: 'latest'}, function(error, event) {
        if (error) {
          console.Error(error);
        } else {
          console.log("added owner: ", event);
        }
      });

      contract.once('OwnershipTransfered', {fromBlock: this.state.ethinfo.chainblock}, function(error, event) {
        if (error) {
          console.Error(error);
        } else {
          console.log("owner transfered: ", event);
        }
      });

      window.alert("Ownership transfered to " + this.state.reciepts.trasnferOwner.transferToAddr);
      this.downloadReciept(transReciept);
    } catch (err) {
      throw new Error(err);
    }
  }

  async adminRightsTransfer() {
    //adminOwnershipTransfer
    const web3 = this.getProvider();
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);

    const adm = contract.methods.presentAdmin.call();
    console.log(adm);
    const transactionData = contract.methods.adminOwnershipTransfer(
      this.state.reciepts.adminTransfer.presentAdmin,
      this.state.reciepts.adminTransfer.newAdmin
      );

    try {
      this.getRequiredGasFee(transactionData, this.state.reciepts.adminTransfer.adminRequestAddr, web3);

      const transactionForm = await web3.eth.accounts.signTransaction(
        {
           from: this.state.reciepts.adminTransfer.adminRequestAddr,
           to: Contract_ADDRESS,
           data: transactionData.encodeABI(),
           gas: this.state.reciepts.adminTransfer.adminRequestGas
        },
        this.state.reciepts.adminTransfer.adminrequestPrivateKey
      );
      const transReciept = await web3.eth.sendSignedTransaction(transactionForm.rawTransaction);

      contract.once('AdminPowerTransfered', {fromBlock: this.state.ethinfo.chainblock}, function(error, event) {
        if (error) {
          console.Error(error);
        } else {
          console.log(event);
        }
      });

      window.alert("New Admin: " + this.state.reciepts.adminTransfer.newAdmin);
      this.downloadReciept(transReciept);
    } catch (err) {

    }
  }

  async trasnactionCount() {
    const web3 = this.getProvider();
    const contract = new web3.eth.Contract(abi, Contract_ADDRESS);
    try {
      contract.methods.getTransactionCount().call().then(result => window.alert("Transaction Count: " + result));
    } catch (err) {
      throw new Error(err);
    }
  }

  downloadReciept(trnsdata){
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(trnsdata)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "Transaction-Reciept" + Date.now() + ".json";

    link.click();
  }


  constructor(props) {
    super(props);
    this.state = {ethinfo: {chainblock: '', network: ''}, owners: [], reciepts: {transaction:{
        senderWalletAddr: '',
        walletPrivateKey: '',
        gasFee: 0,
        recieverAddress: '',
        amount: 0,
        message: ''
      },
      newOwner: {
        addresstoAdd: '',
        senderAddr: '',
        privateKey: '',
        gas: 0
      },
      ownerRemove: {
        addresstoRemove: '',
        removeRequestsenderAddr: '',
        removeRequestPrivateKey: '',
        removeRequestGas: 0
      },
      trasnferOwner: {
        presentOwner: '',
        transferToAddr: '',
        requestAddr: '',
        requestPrivateKey: '',
        requestGas: ''
      },
      adminTransfer: {
        presentAdmin: '',
        newAdmin: '',
        adminRequestAddr: '',
        adminrequestPrivateKey: '',
        adminRequestGas: ''  
      }
    },
    transactionConfirmOrCancel: {
      transId: -1,
      confirmrequestSender: '',
      confirmrequestSenderPrivateKey: '',
      confirmrequestGassFee: 0,
      wantToCancel: "no"
    },
    transExecute: {
      executetransId: 0,
      executeRequestsender: '',
      executeSenderPrivateKey: '',
      executeGasfee: 0
    },
    getTransID: -1,
    visibility: false
    };

    //transaction submission
    this.handleInputChange = this.handleChange.bind(this);
    this.handlesubmission = this.handleSubmit.bind(this);

    //Add new owner
    this.handleownerInputChange = this.handleAddOwnerAddress.bind(this);
    this.handleAddOwner = this.handleOwnerAdd.bind(this);

    //Remove Owner
    this.handleownerInput = this.handleOwnerToRemove.bind(this);
    this.handleownerRemove = this.handleRemoveSubmission.bind(this);

    //transfer ownership
    this.handleownershiptransferInput = this.handleownershipTrasferInput.bind(this);
    this.handleownershiptransferSubmission = this.handleownershipTrasferSubmit.bind(this);

    //admin power transfer
    this.handleadminInput = this.handleAdminInput.bind(this);
    this.handleadminSubmission = this.handleAdminSubmission.bind(this);

    //confirm transaction
    this.handleconfirmInput = this.handleTransConfirmInput.bind(this);
    this.handleconfirmSubmit = this.handleConfirmSubmission.bind(this);

    //execution
    this.handleExecutionInput = this.handleTransExecutionInput.bind(this);
    this.handleExecutionSubmit = this.handleExecutionSubmmision.bind(this);

    //Get Transaction
    this.handleTransDetailInput = this.handleTransDetails.bind(this);
    this.handleTransDetailSubmit = this.handleTransDetailSubmission.bind(this);
  }

  handleChange(evt) {
    this.setState( () => ({
      ...this.state,
      reciepts: {
        ...this.state.reciepts,
        transaction: {
          ...this.state.reciepts.transaction,
          [evt.target.name]: evt.target.value
        }
      }

    }));
  }

  handleSubmit(e) {
    this.submitTransaction();
    this.trasnactionCount();
    e.preventDefault();
  }

  handleAddOwnerAddress(e) {
    this.setState( () => ({
      ...this.state,
      reciepts: {
        ...this.state.reciepts,
        newOwner: {
          ...this.state.reciepts.newOwner,
          [e.target.name]: e.target.value 
        }
      }
    }));
  }

  handleOwnerAdd(e) {
    this.addAddressToOwners();
    e.preventDefault();
  }

  handleOwnerToRemove(e) {
    this.setState( () => ({
      ...this.state,
      reciepts: {
        ...this.state.reciepts,
        ownerRemove: {
          ...this.state.reciepts.ownerRemove,
          [e.target.name]: e.target.value 
        }
      }
    }));
  }

  handleRemoveSubmission(e) {
    this.ownerToRemove();
    e.preventDefault();
  }

  handleownershipTrasferInput(e) {
    this.setState( () => ({
      ...this.state,
      reciepts: {
        ...this.state.reciepts,
        trasnferOwner: {
          ...this.state.reciepts.trasnferOwner,
          [e.target.name]: e.target.value 
        }
      }
    }));
  }

  handleownershipTrasferSubmit(e) {
    this.transferOwnerShip();
    e.preventDefault();
  }

  handleAdminInput(e) {
    this.setState( () => ({
      ...this.state,
      reciepts: {
        ...this.state.reciepts,
        adminTransfer: {
          ...this.state.reciepts.adminTransfer,
          [e.target.name] : e.target.value
        }
      }
    }));
  }

  handleAdminSubmission(e) {
    this.adminRightsTransfer();
    e.preventDefault();
  }

  handleTransConfirmInput(e) {
    this.setState( () => ({
      ...this.state,
      transactionConfirmOrCancel: {
        ...this.state.transactionConfirmOrCancel,
        [e.target.name] : e.target.value
      }
    }));
  }

  handleConfirmSubmission(e) {
    if(this.state.transactionConfirmOrCancel.wantToCancel === "no") {
      this.confirmTransaction();
    } else {
      this.cancelTransaction();
    }
    e.preventDefault();
  }

  handleTransExecutionInput(e) {
    this.setState( () => ({
      ...this.state,
      transExecute: {
        ...this.state.transExecute,
        [e.target.name] : e.target.value
      }
    }));
  }

  handleExecutionSubmmision(e) {
    this.executeTransaction();
    e.preventDefault();
  }

  handleTransDetails(e) {
    this.setState( () => ({
      ...this.state,
      [e.target.name] : e.target.value
    }));
  }

  handleTransDetailSubmission(e) {
    this.showTransaction();
    e.preventDefault();
  }


  render() {
    
    const senderWalletAddr = this.state.reciepts.transaction.senderWalletAddr;
    const walletPrivateKey = this.state.reciepts.transaction.walletPrivateKey;
    const gasFee = this.state.reciepts.transaction.gasFee;
    const recieverAddress = this.state.reciepts.transaction.recieverAddress;
    const amount = this.state.reciepts.transaction.amount;
    const message = this.state.reciepts.transaction.message;

    const addresstoAdd = this.state.reciepts.newOwner.addresstoAdd
    const senderAddr = this.state.reciepts.newOwner.senderAddr
    const privateKey = this.state.reciepts.newOwner.privateKey
    const gas = this.state.reciepts.newOwner.gas

    const addresstoRemove = this.state.reciepts.newOwner.addresstoRemove
    const removeRequestsenderAddr = this.state.reciepts.newOwner.removeRequestsenderAddr
    const removeRequestPrivateKey = this.state.reciepts.newOwner.removeRequestPrivateKey
    const removeRequestGas = this.state.reciepts.newOwner.removeRequestGas

    const presentOwner = this.state.reciepts.trasnferOwner.presentOwner
    const transferToAddr = this.state.reciepts.trasnferOwner.transferToAddr
    const requestAddr = this.state.reciepts.trasnferOwner.requestAddr
    const requestPrivateKey = this.state.reciepts.trasnferOwner.requestPrivateKey
    const requestGas = this.state.reciepts.trasnferOwner.requestGas

    const presentAdmin = this.state.reciepts.adminTransfer.presentAdmin
    const newAdmin = this.state.reciepts.adminTransfer.newAdmin
    const adminRequestAddr = this.state.reciepts.adminRequestAddr
    const adminrequestPrivateKey = this.state.reciepts.adminrequestPrivateKey
    const adminRequestGas = this.state.reciepts.adminRequestGas

    const transId = this.state.transactionConfirmOrCancel.transId
    const confirmrequestSender = this.state.transactionConfirmOrCancel.confirmrequestSender
    const confirmrequestSenderPrivateKey = this.state.transactionConfirmOrCancel.confirmrequestSenderPrivateKey
    const confirmrequestGassFee = this.state.transactionConfirmOrCancel.confirmrequestGassFee
    const wantToCancel = this.state.transactionConfirmOrCancel.wantToCancel

    const executetransId = this.state.transExecute.executetransId
    const executeRequestsender = this.state.transExecute.executeRequestsender
    const executeSenderPrivateKey = this.state.transExecute.executeSenderPrivateKey
    const executeGasfee = this.state.transExecute.executeGasfee

    const getTransID = this.state.getTransID;


    return (
      <div className="container">
        <div className="row mt-5">

          <div>
            <h3>Blockchain Info</h3>
            <button onClick={() => this.setState({visibility: true})}>Expand</button>
            <button onClick={() => this.setState({visibility: false})}>Hide</button>
            {this.state.visibility && 
              <div className="col">
                <p>Network Connected: {this.state.ethinfo.network}</p>
                <p>Ethereum Block: {this.state.ethinfo.chainblock}</p>
                <p>Owners: </p>
                {this.state.owners.map(owner => <div key={owner}> {owner} </div>)}
              </div>
            }
          </div>

          <div>
            <h3>Submit Transaction</h3>
            <button onClick={() => this.setState({visibility: true})}>Expand</button>
            <button onClick={() => this.setState({visibility: false})}>Hide</button>
            {this.state.visibility && 
                <div className="btnDiv">
                  <fieldset>
                      <legend>Set Sender Wallet Address:</legend>
                        <input type="text" name="senderWalletAddr" value={senderWalletAddr} onChange={this.handleInputChange}/>
                        
                      <legend>Wallet Private Key:</legend>
                        <input type="password" name="walletPrivateKey" value={walletPrivateKey} onChange={this.handleInputChange}/>

                      <legend>Set Gas Fee:</legend>
                        <input type="number" name="gasFee"  value={gasFee} onChange={this.handleInputChange}/>

                      <legend>Set Receiver Address:</legend>
                        <input type="text" name="recieverAddress"  value={recieverAddress} onChange={this.handleInputChange}/>

                      <legend>Amount to transact:</legend>
                        <input type="number" name="amount"  value={amount} onChange={this.handleInputChange}/>

                      <legend>Message:</legend>
                        <input type="text" name="message"  value={message} onChange={this.handleInputChange}/>
                  </fieldset>
                  <button id="downloadBtn" onClick={this.handlesubmission} value="download">Submit</button>
                </div>
            }
          </div>

          <div>
            <h3>Add Owner</h3>
            <button onClick={() => this.setState({visibility: true})}>Expand</button>
            <button onClick={() => this.setState({visibility: false})}>Hide</button>
            {this.state.visibility && 
                <div className="btnDiv">
                  <fieldset>
                    <legend>Sender Wallet:</legend>
                    <input type="text" name="senderAddr" value={senderAddr} onChange={this.handleownerInputChange}/>

                    <legend>Sender Wallet PrivateKey:</legend>
                    <input type="password" name="privateKey" value={privateKey} onChange={this.handleownerInputChange}/>

                    <legend>Owner Address:</legend>
                    <input type="text" name="addresstoAdd" value={addresstoAdd} onChange={this.handleownerInputChange}/>

                    <legend>Gas Fee:</legend>
                    <input type="number" name="gas" value={gas} onChange={this.handleownerInputChange}/>
                  </fieldset>
                  <button id="downloadBtn" onClick={this.handleAddOwner} value="download">Submit</button>
                </div>
            }
          </div>

          <div>
            <h3>Remove Owner</h3>
            <button onClick={() => this.setState({visibility: true})}>Expand</button>
            <button onClick={() => this.setState({visibility: false})}>Hide</button>
            {this.state.visibility && 
                <div className="btnDiv">
                  <fieldset>
                    <legend>Sender Wallet:</legend>
                    <input type="text" name="removeRequestsenderAddr" value={removeRequestsenderAddr} onChange={this.handleownerInput}/>

                    <legend>Sender Wallet PrivateKey:</legend>
                    <input type="password" name="removeRequestPrivateKey" value={removeRequestPrivateKey} onChange={this.handleownerInput}/>

                    <legend>Remove Address:</legend>
                    <input type="text" name="addresstoRemove" value={addresstoRemove} onChange={this.handleownerInput}/>

                    <legend>Gas Fee:</legend>
                    <input type="number" name="removeRequestGas" value={removeRequestGas} onChange={this.handleownerInput}/>
                  </fieldset>
                  <button id="downloadBtn" onClick={this.handleownerRemove} value="download">Submit</button>
                </div>
            }
          </div>

          <div>
            <h3>Transfer Ownership</h3>
            <button onClick={() => this.setState({visibility: true})}>Expand</button>
            <button onClick={() => this.setState({visibility: false})}>Hide</button>
            {this.state.visibility && 
                <div className="btnDiv">
                  <fieldset>
                    <legend>Present Owner:</legend>
                    <input type="text" name="presentOwner" value={presentOwner} onChange={this.handleownershiptransferInput}/>

                    <legend>Transfer To:</legend>
                    <input type="text" name="transferToAddr" value={transferToAddr} onChange={this.handleownershiptransferInput}/>

                    <legend>Sender Address:</legend>
                    <input type="text" name="requestAddr" value={requestAddr} onChange={this.handleownershiptransferInput}/>

                    <legend>Sender PrivateKey:</legend>
                    <input type="password" name="requestPrivateKey" value={requestPrivateKey} onChange={this.handleownershiptransferInput}/>

                    <legend>Gas Fee:</legend>
                    <input type="number" name="requestGas" value={requestGas} onChange={this.handleownershiptransferInput}/>
                  </fieldset>
                  <button id="downloadBtn" onClick={this.handleownershiptransferSubmission} value="download">Submit</button>
                </div>
            }
          </div>

          <div>
            <h3>Transfer Admin</h3>
            <button onClick={() => this.setState({visibility: true})}>Expand</button>
            <button onClick={() => this.setState({visibility: false})}>Hide</button>
            {this.state.visibility && 
                <div className="btnDiv">
                  <fieldset>
                    <legend>Present Admin:</legend>
                    <input type="text" name="presentAdmin" value={presentAdmin} onChange={this.handleadminInput}/>

                    <legend>New Admin:</legend>
                    <input type="text" name="newAdmin" value={newAdmin} onChange={this.handleadminInput}/>

                    <legend>Sender Address:</legend>
                    <input type="text" name="adminRequestAddr" value={adminRequestAddr} onChange={this.handleadminInput}/>

                    <legend>Sender PrivateKey:</legend>
                    <input type="password" name="adminrequestPrivateKey" value={adminrequestPrivateKey } onChange={this.handleadminInput}/>

                    <legend>Gas Fee:</legend>
                    <input type="number" name="adminRequestGas" value={adminRequestGas} onChange={this.handleadminInput}/>
                  </fieldset>
                  <button id="downloadBtn" onClick={this.handleadminSubmission} value="download">Submit</button>
                </div>
            }
          </div>

          <div>
            <h3>Confirm/Cancel Transaction</h3>
            <button onClick={() => this.setState({visibility: true})}>Expand</button>
            <button onClick={() => this.setState({visibility: false})}>Hide</button>
            {this.state.visibility && 
                <div className="btnDiv">
                  <fieldset>
                    <legend>Transaction ID:</legend>
                    <input type="number" name="transId" value={transId} onChange={this.handleconfirmInput}/>

                    <legend>Sender Address:</legend>
                    <input type="text" name="confirmrequestSender" value={confirmrequestSender} onChange={this.handleconfirmInput}/>

                    <legend>Sender PrivateKey:</legend>
                    <input type="password" name="confirmrequestSenderPrivateKey" value={confirmrequestSenderPrivateKey } onChange={this.handleconfirmInput}/>

                    <legend>Gas Fee:</legend>
                    <input type="number" name="confirmrequestGassFee" value={confirmrequestGassFee} onChange={this.handleconfirmInput}/>

                    <legend>Want to cancel?:</legend>
                    <input type="text" name="wantToCancel" value={wantToCancel} onChange={this.handleconfirmInput}/>
                  </fieldset>
                  <button id="downloadBtn" onClick={this.handleconfirmSubmit} value="download">Submit</button>
                </div>
            }
          </div>

          <div>
            <h3>Transaction Details</h3>
            <button onClick={() => this.setState({visibility: true})}>Expand</button>
            <button onClick={() => this.setState({visibility: false})}>Hide</button>
            {this.state.visibility && 
                <div className="btnDiv">
                  <fieldset>
                    <legend>Transaction ID:</legend>
                    <input type="number" name="getTransID" value={getTransID} onChange={this.handleTransDetailInput}/>
                  </fieldset>
                  <button id="downloadBtn" onClick={this.handleTransDetailSubmit} value="download">Submit</button>
                </div>
            }
          </div>

          <div>
            <h3>Execute Transaction</h3>
            <button onClick={() => this.setState({visibility: true})}>Expand</button>
            <button onClick={() => this.setState({visibility: false})}>Hide</button>
            {this.state.visibility && 
                <div className="btnDiv">
                  <fieldset>
                    <legend>Transaction ID:</legend>
                    <input type="number" name="executetransId" value={executetransId} onChange={this.handleExecutionInput}/>

                    <legend>Sender Address:</legend>
                    <input type="text" name="executeRequestsender" value={executeRequestsender} onChange={this.handleExecutionInput}/>

                    <legend>Sender PrivateKey:</legend>
                    <input type="password" name="executeSenderPrivateKey" value={executeSenderPrivateKey } onChange={this.handleExecutionInput}/>

                    <legend>Gas Fee:</legend>
                    <input type="number" name="executeGasfee" value={executeGasfee} onChange={this.handleExecutionInput}/>
                  </fieldset>
                  <button id="downloadBtn" onClick={this.handleExecutionSubmit} value="download">Submit</button>
                </div>
            }
          </div>

        </div>
      </div>
    );
  }
}

export default App;