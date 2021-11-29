const EllipticalArtNFT = artifacts.require("EllipticalArtNFT");
const utils = require("./helpers/utils");
const time = require("./helpers/time");

const ellipticals = [
  { name: "Elliptical 1", description: "my beautiful and rare art piece" },
  { name: "Elliptical 2", description: "the rarest piece in the world" },
];

const RINKEBY_VRF_COORDINATOR = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B";
const RINKEBY_LINKTOKEN = "0x01be23585060835e02b77ef475b0cc51aa1e0709";
const RINKEBY_KEYHASH =
  "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
const RINKEBY_ETH_USD_PRICE_FEED = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";
const RINKEBY_MAX_SUPPLY = 100;

contract("EllipticalArtNFT", (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await EllipticalArtNFT.new(
      RINKEBY_VRF_COORDINATOR,
      RINKEBY_LINKTOKEN,
      RINKEBY_KEYHASH,
      RINKEBY_ETH_USD_PRICE_FEED,
      RINKEBY_MAX_SUPPLY
    );
  });

  it("should be able to create a new elliptical", async () => {
    console.log(contractInstance);
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

  xit("should not allow more than one elliptical minted per address within a 24 hour period", async () => {
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

  xit("should not allow more than two ellipticals minted per address in total", async () => {
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

  xcontext("with the single-step transfer scenario", async () => {
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
  xcontext("with the two-step transfer scenario", async () => {
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
