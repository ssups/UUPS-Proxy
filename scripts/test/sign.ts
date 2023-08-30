import { ethers } from "hardhat";
import * as crypto from "crypto";

async function main() {
  // Ethereum transaction parameters
  const nonce = 0; // Replace with the actual nonce for your account
  const gasPrice = 21000; // Replace with the desired gas price
  const gasLimit = 21000; // Replace with the desired gas limit
  const toAddress = "0xYourRecipientAddress";
  const value = "1000000000000000000"; // 1 ETH in Wei
  const data = "0x"; // Replace with any data you want to include in the transaction

  // Private key (replace with your actual private key)
  const privateKeyHex = "your_private_key_hex_here";

  // Convert private key hex to a Buffer
  const privateKeyBuffer = Buffer.from(privateKeyHex, "hex");

  // Calculate the transaction hash
  const transactionHash = crypto
    .createHash("sha3-256")
    .update(
      Buffer.concat([
        Buffer.from(toAddress.slice(2), "hex"),
        privateKeyBuffer,
        Buffer.from(nonce.toString(16), "hex"),
        Buffer.from(gasPrice.toString(16), "hex"),
        Buffer.from(gasLimit.toString(16), "hex"),
        Buffer.from(value.slice(2), "hex"),
        Buffer.from(data.slice(2), "hex"),
      ])
    )
    .digest("hex");

  // Create an ECDSA key object from the private key
  const ecdsaKey = crypto.createPrivateKey(privateKeyBuffer);

  // Sign the transaction hash
  const signature = crypto.sign(null, Buffer.from(transactionHash, "hex"), ecdsaKey);

  // Convert the signature to hex format
  const signatureHex = signature.toString("hex");

  console.log("Transaction Hash:", transactionHash);
  console.log("Signature:", signatureHex);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
