const EllipticalArtNFT = artifacts.require("EllipticalArtNFT");
const utils = require("./helpers/utils");
const time = require("./helpers/time");

const ellipticals = [
  { name: "Elliptical 1", description: "my beautiful and rare art piece" },
  { name: "Elliptical 2", description: "the rarest piece in the world" },
];

contract("EllipticalArtNFT", (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await EllipticalArtNFT.new();
  });

  it("should be able to create a new elliptical", async () => {
    const result = await contractInstance.requestNewRandomElliptical(
      ellipticals[0].name,
      ellipticals[0].description,
      {
        from: alice,
      }
    );

    assert.equal(result.receipt.status, true);
    assert.equal(result.logs[0].args.name, ellipticals[0].name);
  });

  it("should not allow more than one elliptical minted per address within a 24 hour period", async () => {
    await contractInstance.requestNewRandomElliptical(
      ellipticals[0].name,
      ellipticals[0].description,
      {
        from: bob,
      }
    );

    await utils.shouldThrow(
      contractInstance.requestNewRandomElliptical(
        ellipticals[1].name,
        ellipticals[1].description,
        {
          from: bob,
        }
      )
    );
  });

  it("should not allow more than two ellipticals minted per address in total", async () => {
    await contractInstance.requestNewRandomElliptical(
      ellipticals[0].name,
      ellipticals[0].description,
      {
        from: alice,
      }
    );

    await time.increase(time.duration.days(2));

    await contractInstance.requestNewRandomElliptical(
      ellipticals[0].name,
      ellipticals[0].description,
      {
        from: alice,
      }
    );

    await utils.shouldThrow(
      contractInstance.requestNewRandomElliptical(
        ellipticals[1].name,
        ellipticals[1].description,
        {
          from: alice,
        }
      )
    );
  });

  context("with the single-step transfer scenario", async () => {
    it("should transfer an elliptical", async () => {
      const result = await contractInstance.requestNewRandomElliptical(
        ellipticals[0].name,
        ellipticals[0].description,
        {
          from: alice,
        }
      );
      const ellipticalId = result.logs[0].args.id.toNumber();
      await contractInstance.transferFrom(alice, bob, ellipticalId, {
        from: alice,
      });
      const newOwner = await contractInstance.ownerOf(ellipticalId);
      assert.equal(newOwner, bob);
    });
  });
  context("with the two-step transfer scenario", async () => {
    it("should approve and then transfer an elliptical when the approved address calls transferFrom", async () => {
      const result = await contractInstance.requestNewRandomElliptical(
        ellipticals[0].name,
        ellipticals[0].description,
        {
          from: alice,
        }
      );
      const ellipticalId = result.logs[0].args.id.toNumber();
      await contractInstance.approve(bob, ellipticalId, { from: alice });
      await contractInstance.transferFrom(alice, bob, ellipticalId, {
        from: bob,
      });
      const newOwner = await contractInstance.ownerOf(ellipticalId);

      assert.equal(newOwner, bob);
    });
    it("should approve and then transfer an elliptical when the owner calls transferFrom", async () => {
      const result = await contractInstance.requestNewRandomElliptical(
        ellipticals[0].name,
        ellipticals[0].description,
        {
          from: alice,
        }
      );
      const ellipticalId = result.logs[0].args.id.toNumber();
      await contractInstance.approve(bob, ellipticalId, { from: alice });
      await contractInstance.transferFrom(alice, bob, ellipticalId, {
        from: alice,
      });
      const newOwner = await contractInstance.ownerOf(ellipticalId);
      assert.equal(newOwner, bob);
    });
  });
});
