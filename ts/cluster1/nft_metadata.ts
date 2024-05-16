import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import base58 from "bs58";

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
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image =
      "https://arweave.net/PgM8Pf9rKUD8H4QlOBmpvoHt76IHtIRboutsf3llQgk";
    const metadata = {
      name: "Dread",
      symbol: "DRD",
      description: "dread's rug",
      image: image,
      attributes: [{ trait_type: "Rectangular", value: "?" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [],
    };

    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your image URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
