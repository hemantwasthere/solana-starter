import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import base58 from "bs58";
import { readFile } from "fs/promises";

import wallet from "../wba-wallet.json";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

const walletbase58 = base58.decode(wallet);
let keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(walletbase58)
);
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    //1. Load image
    //2. Convert image to generic file.
    //3. Upload image

    const image = await readFile("./megane.jpg");

    const img_gen = createGenericFile(image, "dreaded_rug", {
      contentType: "image/jpg",
    });

    // const [myUri] = irysUploader().upload([img_gen]);
    const [myUri] = await umi.uploader.upload([img_gen]);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
