const DungeonsAndDragons = artifacts.require("DungeonsAndDragonsCharacter");
const TOKENID = 0;
module.exports = async (callback) => {
  try {
    const dnd = await DungeonsAndDragons.deployed();
    console.log("Let's set the tokenURI of your characters");
    const tx = await dnd.setTokenURI(
      0,
      "https://ipfs.io/ipfs/bafyreifm7dcq7qs77cf5metrny6vicyzht54u6tmnnjhqecgnzk5yh2rmu/metadata.json"
    );
    const tx1 = await dnd.setTokenURI(
      1,
      "https://ipfs.io/ipfs/bafyreib6wh3xwndenk4zcsq4n27jwebhfe3blmgfmwxyxp2ucksszowxyq/metadata.json"
    );
    const tx2 = await dnd.setTokenURI(
      2,
      "https://ipfs.io/ipfs/bafyreihtsgfkcfpqlew7ui3g52fsgbdlcgzt56w4g67varjc4nnoyeif7a/metadata.json"
    );
    const tx3 = await dnd.setTokenURI(
      3,
      "https://ipfs.io/ipfs/bafyreie3hsnq2citifgiri4f5j33l5eb5eitkjwco6pqklfgbbms63m2h4/metadata.json"
    );
    console.log(tx);
    callback(tx.tx);
  } catch (error) {
    callback(error);
  }
};
