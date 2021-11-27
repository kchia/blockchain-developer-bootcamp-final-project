const EllipticalArtNFT = artifacts.require("EllipticalArtNFT");

async function getElliptical(callback) {
  try {
    const contract = await EllipticalArtNFT.deployed();
    console.log("Let's get the overview of your elliptical.");
    const overview = await contract.ellipticals(0);
    console.log(overview);
    callback(overview.tx);
  } catch (error) {
    callback(error);
  }
}

module.exports = async (callback) => {
  getElliptical(callback);
};
