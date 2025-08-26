import { expect } from "chai";
import * as hre from "hardhat";
import { type Contract, type Wallet } from "zksync-ethers";
import { getWallet, LOCAL_RICH_WALLETS, deployContract } from "../deploy/utils";

describe("SimplePollVoteAction", function () {
  const owner = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
  
  // ActionHub on testnet
  const ACTION_HUB = "0x4A92a97Ff3a3604410945ae8CA25df4fBB2fDC11";

  describe("Deployment", function () {
    it("Should deploy successfully to the action hub", async function () {
      const action = await deployContract("SimplePollVoteAction", [ACTION_HUB, owner.address], {
        wallet: owner,
        silent: true,
      });

      const address = await action.getAddress();
      expect(address).to.be.properAddress;
    });

    it("Should set the correct owner", async function () {
      const action = await deployContract("SimplePollVoteAction", [ACTION_HUB, owner.address], {
        wallet: owner,
        silent: true,
      });

      expect(await action.owner()).to.equal(owner.address);
    });
  });

  describe("Vote Counting", function () {
    let action: Contract;

    beforeEach(async function () {
      action = await deployContract("SimplePollVoteAction", [ACTION_HUB, owner.address], {
        wallet: owner,
        silent: true,
      });
    });

    it("Should return zero counts for any feed/post combination initially", async function () {
      // Just test that the getVoteCounts function works and returns zeros
      const [ya, nay] = await action.getVoteCounts("0x1111111111111111111111111111111111111111", 1);
      expect(ya).to.equal(0);
      expect(nay).to.equal(0);
    });
  });
});
