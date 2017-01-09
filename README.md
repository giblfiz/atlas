The Ethereum Atlas Project is currently running live on the testnet blockchian

You can use it in two ways:
1) visit the LIVE demo site at <a href=http://34.192.3.172>34.192.3.172</a> (someday when DNS finishes
   this will be ethereumatlas.online)

   This is connected to public geth node, and should run on any modern browser

   You can click the Transfer link or the Create link in the upper right hand corner to interact with the land parcel management system
   NOTE: the QR code scanning feature will not work for the moment due to HTTPS requirements

2) You can clone and deploy this on your own machine. Simply clone the repository and use node to launch it in the "client_public" directory

  This will, by default, connect to the same remote public geth node. If you wish to connect to a locally running node you can change the Web3.providers.HttpProvider in pages/transfer/index.js and pages/create/index.js

  You should note that your private accounts will NOT be "officer" types, so it will be impossible to complete any transactions this way.



  ##How to transfer a parcel
  For any parcel transfer to complete it needs EITHER:
  A) The transfer to be completed by a Notary and by any account with the secret key for the parcel
  B) The transfer to be completed by a Notary account, a federal account and a Judicial account  

  You can watch the demo video to see how this can be done
