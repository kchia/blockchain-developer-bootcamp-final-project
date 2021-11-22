const ContractTemplate = artifacts.require("ContractTemplate");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ContractTemplate", function (/* accounts */) {
  it("should assert true", async function () {
    await ContractTemplate.deployed();
    return assert.isTrue(true);
  });
});
