require("dotenv").config();
const { NFTStorage, File } = require("nft.storage");
const fs = require("fs");

const apiKey = process.env.NFTSTORAGE_API_KEY;
const client = new NFTStorage({ token: apiKey });

async function updateMetadataImage(metadata) {
  const [, second, third] = metadata.name.split(" ");
  const imageName = `${second}_${third}.png`;
  metadata.image = new File(
    [
      fs.readFileSync(
        `/Users/houchia/consensys/blockchain-developer-bootcamp-final-project/contracts/images/${imageName}`
      ),
    ],
    imageName,
    {
      type: "image/png",
    }
  );
  return metadata;
}

async function filecoinDeploy(callback) {
  const files = fs.readdirSync(
    "/Users/houchia/consensys/blockchain-developer-bootcamp-final-project/contracts/metadata"
  );
  const characters = files.map((file) => {
    const character = JSON.parse(
      fs.readFileSync(
        `/Users/houchia/consensys/blockchain-developer-bootcamp-final-project/contracts/metadata/${file}`,
        { encoding: "utf8" }
      )
    );
    updateMetadataImage(character);
    return character;
  });

  const metadata = characters.map(async (json) => await client.store(json));

  metadata.forEach((nft) => nft.then(console.log));

  callback();
}

module.exports = async (callback) => {
  filecoinDeploy(callback);
};
