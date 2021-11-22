const ContractTemplate = artifacts.require("./ContractTemplate.sol");

module.exports = function (deployer) {
  deployer.deploy(ContractTemplate);
};
