const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AirdropClaimer", function () {

  let AirdropClaimer, airdropClaimer, owner, PartyToken, partyToken, test_addr1;
  beforeEach(async function () {
    [owner, test_addr1] = await ethers.getSigners();

    PartyToken = await ethers.getContractFactory("PartyToken");
    partyToken = await PartyToken.deploy(owner.address);
    await partyToken.deployed();

    AirdropClaimer = await ethers.getContractFactory("AirdropClaimer");
    // VIPG 3101.71 each validator
    airdropClaimer = await AirdropClaimer.deploy(partyToken.address, '3101710000000000000000');
    await airdropClaimer.deployed();
  })

  describe("Basics", function () {
    it("If owner transfers, contract should have a balance of 2000 test PARTY", async function () {
      await partyToken.transfer(airdropClaimer.address, 2000);
      await expect(await partyToken.balanceOf(airdropClaimer.address)).to.equal('2000');
    });

    it("Shouldn't let me claim PARTY tokens if i'm not calling from a whitelisted c-chain address", async function () {
      await expect(airdropClaimer.claim()).to.be.revertedWith('ERROR: You are not whitelisted');
    });

    it("Should let owner whitelist and blacklist an address", async function () {
      await expect(airdropClaimer.whitelist(test_addr1.address)).not.to.be.reverted;
      await expect(airdropClaimer.blacklist(test_addr1.address)).not.to.be.reverted;
    });

    it("Should not let other users whitelist or blacklist anybody", async function () {
      await expect(airdropClaimer.connect(test_addr1).whitelist(test_addr1.address)).to.be.reverted;
      await expect(airdropClaimer.connect(test_addr1).blacklist(test_addr1.address)).to.be.reverted;
    });

    it("Should be deployed with 3101710000000000000000 as amount per user", async function () {
      await expect(await airdropClaimer.getAmountPerAddress()).to.equal('3101710000000000000000');
    });

    it("Should let owner modify the amount each user can receive in the airdrop", async function () {
      await expect(airdropClaimer.setAmountPerAddress('5000000000000000000000')).not.to.be.reverted;
      await expect(await airdropClaimer.getAmountPerAddress()).to.equal('5000000000000000000000');
    })

    it('An user should be able to claim and receive the corresponding tokens, then, user should be out of whitelist and in blacklist', async function () {
      // lock 10000000000000000000000 (10k) tokens
      await partyToken.transfer(airdropClaimer.address, '10000000000000000000000');
      await expect(await partyToken.balanceOf(airdropClaimer.address)).to.equal('10000000000000000000000');

      // whitelist test_addr1
      await expect(airdropClaimer.connect(owner).whitelist(test_addr1.address)).not.to.be.reverted;

      // make test_addr1 claim its tokens
      await expect(airdropClaimer.connect(test_addr1).claim()).not.to.be.reverted;

      // check test_addr1 balance, should have a portion of 3101710000000000000000 (3,101.71 PARTY)
      await expect(await partyToken.balanceOf(test_addr1.address)).to.equal('3101710000000000000000');

      // check whitelist
      await expect(await airdropClaimer.isWhitelisted(test_addr1.address)).to.equal(false);

      //check blacklist
      await expect(await airdropClaimer.isBlacklisted(test_addr1.address)).to.equal(true);
    })
  })
});
