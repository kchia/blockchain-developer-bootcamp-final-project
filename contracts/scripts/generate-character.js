const EllipticalArtNFT = artifacts.require("EllipticalArtNFT");

module.exports = async (callback) => {
  try {
    const dnd = await EllipticalArtNFT.deployed();
    console.log("Creating requests on contract:", dnd.address);
    const tx = await dnd.requestNewRandomCharacter("The Chainlink Knight");
    const tx2 = await dnd.requestNewRandomCharacter("The Chainlink Elf");
    const tx3 = await dnd.requestNewRandomCharacter("The Chainlink Wizard");
    const tx4 = await dnd.requestNewRandomCharacter("The Chainlink Orc");
    callback(tx.tx);
  } catch (error) {
    callback(error);
  }
};
