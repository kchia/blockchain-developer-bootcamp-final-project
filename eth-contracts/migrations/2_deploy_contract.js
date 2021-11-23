const DungeonsAndDragonsContract = artifacts.require(
  "./DungeonsAndDragons.sol"
);

module.exports = function (deployer) {
  deployer.deploy(DungeonsAndDragonsContract);
};
