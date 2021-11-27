const EllipticalArtNFT = artifacts.require("EllipticalArtNFT");
const fs = require("fs");

async function createMetadata(callback) {
  const contract = await EllipticalArtNFT.deployed();
  const length = await contract.getEllipticalsCount();

  for (let index = 0; index < length; index++) {
    console.log(
      `Let's get the overview of your elliptical ${index} of ${length}`
    );
    const elliptical = await contract.ellipticals(index);
    const ellipticalMetadata = {
      name: elliptical.name,
      description: "",
      image: "",
    };

    if (
      fs.existsSync(
        `metadata/${ellipticalMetadata.name
          .toLowerCase()
          .replace(/\s/g, "-")}.json`
      )
    ) {
      console.log("test");
      continue;
    }

    const {
      v1: {
        words: [v1],
      },
      v2: {
        words: [v2],
      },
      v3: {
        words: [v3],
      },
      alpha: {
        words: [alpha],
      },
      x: {
        words: [x],
      },
      y: {
        words: [y],
      },
      w: {
        words: [w],
      },
      h: {
        words: [h],
      },
    } = elliptical;

    ellipticalMetadata.attributes = [
      { trait_type: "v1", value: v1 },
      { trait_type: "v2", value: v2 },
      { trait_type: "v3", value: v3 },
      { trait_type: "alpha", value: alpha },
      { trait_type: "x", value: x },
      { trait_type: "y", value: y },
      { trait_type: "w", value: w },
      { trait_type: "h", value: h },
    ];

    fs.writeFileSync(
      `metadata/${ellipticalMetadata.name
        .toLowerCase()
        .replace(/\s/g, "-")}.json`,
      JSON.stringify(ellipticalMetadata)
    );
  }
  callback(contract);
}

module.exports = (callback) => {
  createMetadata(callback);
};
