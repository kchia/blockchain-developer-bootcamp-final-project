const EllipticalArtNFT = artifacts.require("EllipticalArtNFT");
const VRFCoordinatorMock = artifacts.require("VRFCoordinatorMock");
const MockPriceFeed = artifacts.require("MockV3Aggregator");

const { LinkToken } = require("@chainlink/contracts/truffle/v0.4/LinkToken");
const RINKEBY_VRF_COORDINATOR = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B";
const RINKEBY_LINKTOKEN = "0x01be23585060835e02b77ef475b0cc51aa1e0709";
const RINKEBY_KEYHASH =
  "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
const RINKEBY_ETH_USD_PRICE_FEED = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";
const RINKEBY_MAX_SUPPLY = 100;

module.exports = async (deployer, network, [defaultAccount]) => {
  LinkToken.setProvider(deployer.provider);
  EllipticalArtNFT.setProvider(deployer.provider);
  if (network.startsWith("rinkeby")) {
    await deployer.deploy(
      EllipticalArtNFT,
      RINKEBY_VRF_COORDINATOR,
      RINKEBY_LINKTOKEN,
      RINKEBY_KEYHASH,
      RINKEBY_ETH_USD_PRICE_FEED,
      RINKEBY_MAX_SUPPLY
    );
  } else {
    console.log(
      "Running tests in development mode...mocking Chainlink VRF and price feed...."
    );
    let keyhash =
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
    let link = await LinkToken.new({ from: defaultAccount });
    let vrfCoordinatorMock = await VRFCoordinatorMock.new(link.address, {
      from: defaultAccount,
    });
    let mockPriceFeed = await MockPriceFeed.new(8, "2000000000000000000");
    await deployer.deploy(
      EllipticalArtNFT,
      vrfCoordinatorMock.address,
      link.address,
      keyhash,
      mockPriceFeed.address,
      RINKEBY_MAX_SUPPLY,
      { from: defaultAccount }
    );
  }
  await EllipticalArtNFT.deployed();
};
