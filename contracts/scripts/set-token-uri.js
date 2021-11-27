const EllipticalArtNFT = artifacts.require("EllipticalArtNFT");

async function setTokenURI(urls, callback) {
  try {
    const contract = await EllipticalArtNFT.deployed();
    console.log("Let's set the tokenURI of your characters");
    const transactions = urls.map(
      async (url, index) => await contract.setTokenURI(index, url)
    );
    await Promise.all(transactions);
    transactions.forEach((tx) => console.log(tx.tx));
    callback(transactions);
  } catch (error) {
    callback(error);
  }
}

module.exports = async (callback) => {
  setTokenURI(
    [
      "https://ipfs.io/ipfs/bafyreifm7dcq7qs77cf5metrny6vicyzht54u6tmnnjhqecgnzk5yh2rmu/metadata.json",
      "https://ipfs.io/ipfs/bafyreib6wh3xwndenk4zcsq4n27jwebhfe3blmgfmwxyxp2ucksszowxyq/metadata.json",
      "https://ipfs.io/ipfs/bafyreihtsgfkcfpqlew7ui3g52fsgbdlcgzt56w4g67varjc4nnoyeif7a/metadata.json",
      "https://ipfs.io/ipfs/bafyreie3hsnq2citifgiri4f5j33l5eb5eitkjwco6pqklfgbbms63m2h4/metadata.json",
    ],
    callback
  );
};
