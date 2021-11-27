const EllipticalArtNFT = artifacts.require("EllipticalArtNFT");

module.exports = async (callback) => {
  try {
    const dnd = await EllipticalArtNFT.deployed();
    console.log("Let's get the overview of your character");
    const overview = await dnd.characters(0);
    console.log(overview);
    callback(overview.tx);
  } catch (error) {
    callback(error);
  }
};
