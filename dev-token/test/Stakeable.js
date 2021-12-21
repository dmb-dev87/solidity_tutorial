const DevToken = artifacts.require("DevToken");
const { assert } = require('chai');
const truffleAssert = require('truffle-assertions');
contract("DevToken", async accounts => {
  it("Staking 100x2", async () => {
    devToken = await DevToken.deployed();

    let owner = accounts[0];
    let stake_amount = 100;
    await devToken.mint(accounts[1], 1000);
    balance = await devToken.balanceOf(owner)

    stakeID = await devToken.stake(stake_amount, { from: owner });
    truffleAssert.eventEmitted(
      stakeID,
      "Staked",
      (ev) => {
          // In here we can do our assertion on the ev variable (its the event and will contain the values we emitted)
          assert.equal(ev.amount, stake_amount, "Stake amount in event was not correct");
          assert.equal(ev.index, 1, "Stake index was not correct");
          return true;
      },
      "Stake event should have triggered");
  });

  it("cannot stake more than owning", async() => {
    devToken = await DevToken.deployed();

    try{
      await devToken.stake(1000000000, { from: accounts[2]});
    }catch(error){
      assert.equal(error.reason, "DevToken: Cannot stake more than you own");
    }
  });

  it("new stakeholder should have increased index", async () => {
    let stake_amount = 100;
    stakeID = await devToken.stake(stake_amount, { from: accounts[1] });
    truffleAssert.eventEmitted(
      stakeID,
      "Staked",
      (ev) => {
          // In here we can do our assertion on the ev variable (its the event and will contain the values we emitted)
          assert.equal(ev.amount, stake_amount, "Stake amount in event was not correct");
          assert.equal(ev.index, 2, "Stake index was not correct");
          return true;
      },
      "Stake event should have triggered");
  })
});