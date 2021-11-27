const EllipticalArtNFT = artifacts.require("EllipticalArtNFT");
const utils = require("./helpers/utils");
const time = require("./helpers/time");

const ellipticalArtNames = ["Elliptical 1", "Elliptical 2"];

contract("EllipticalArtNFT", (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await EllipticalArtNFT.new();
  });

  it("should be able to create a new elliptical", async () => {
    const result = await contractInstance.requestNewRandomElliptical(
      ellipticalArtNames[0],
      {
        from: alice,
      }
    );

    assert.equal(result.receipt.status, true);
    assert.equal(result.logs[0].args.name, ellipticalArtNames[0]);
  });

  it("should not allow more than one elliptical minted per address within a 24 hour period", async () => {
    await contractInstance.requestNewRandomElliptical(ellipticalArtNames[0], {
      from: bob,
    });

    await utils.shouldThrow(
      contractInstance.requestNewRandomElliptical(ellipticalArtNames[1], {
        from: bob,
      })
    );
  });

  it("should not allow more than two ellipticals minted per address in total", async () => {
    await contractInstance.requestNewRandomElliptical(ellipticalArtNames[0], {
      from: alice,
    });

    await time.increase(time.duration.days(2));

    await contractInstance.requestNewRandomElliptical(ellipticalArtNames[0], {
      from: alice,
    });

    await utils.shouldThrow(
      contractInstance.requestNewRandomElliptical(ellipticalArtNames[1], {
        from: alice,
      })
    );
  });

  context("with the single-step transfer scenario", async () => {
    it("should transfer an elliptical", async () => {
      const result = await contractInstance.requestNewRandomElliptical(
        ellipticalArtNames[0],
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
        ellipticalArtNames[0],
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
        ellipticalArtNames[0],
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
