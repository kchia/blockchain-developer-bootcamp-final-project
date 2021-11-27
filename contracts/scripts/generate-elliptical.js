const EllipticalArtNFT = artifacts.require("EllipticalArtNFT");

async function generateElliptical(callback) {
  try {
    const contract = await EllipticalArtNFT.deployed();
    console.log("Creating requests on contract:", contract.address);
    const { tx: tx1 } = await contract.requestNewRandomElliptical(
      "Elliptical 1"
    );
    const { tx: tx2 } = await contract.requestNewRandomElliptical(
      "Elliptical 2"
    );
    const { tx: tx3 } = await contract.requestNewRandomElliptical(
      "Elliptical 3"
    );
    const { tx: tx4 } = await contract.requestNewRandomElliptical(
      "Elliptical 4"
    );
    callback({ tx1, tx2, tx3, tx4 });
  } catch (error) {
    callback(error);
  }
}
module.exports = async (callback) => {
  generateElliptical(callback);
};
