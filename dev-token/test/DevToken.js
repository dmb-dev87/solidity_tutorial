const DevToken = artifacts.require("DevToken");

contract("DevToken", async accounts => {

  it("initial supply", async () => {
    devToken = await DevToken.deployed();
    let supply = await devToken.totalSupply()
    assert.equal(supply.toNumber(), 5000000, "Initial supply was not the same as in migration")
  });

  it("minting", async() => {
    devToken = await DevToken.deployed(); 

    let intial_balance = await devToken.balanceOf(accounts[1]);

    assert.equal(intial_balance.toNumber(), 0, "intial balance for account 1 should be 0")

    let totalSupply = await devToken.totalSupply();
    await devToken.mint(accounts[1], 100);

    let after_balance = await devToken.balanceOf(accounts[1]);
    let after_supply = await devToken.totalSupply();

    assert.equal(after_balance.toNumber(), 100, "The balance after minting 100 should be 100")
    assert.equal(after_supply.toNumber(), totalSupply.toNumber()+100, "The totalSupply should have been increasesd")

    try {
      await devToken.mint('0x0000000000000000000000000000000000000000', 100);
    }catch(error){
      assert.equal(error.reason, "DevToken: cannot mint to zero address", "Failed to stop minting on zero address")
    }
  })

  it("burning", async() => {
    devToken = await DevToken.deployed();

    let initial_balance = await devToken.balanceOf(accounts[1]);

    try{
      await devToken.burn('0x0000000000000000000000000000000000000000', 100);
    }catch(error){
      assert.equal(error.reason, "DevToken: cannot burn from zero address", "Failed to notice burning on 0 address")
    }

    try {
      await devToken.burn(accounts[1], initial_balance+initial_balance);
    }catch(error){
      assert.equal(error.reason, "DevToken: Cannot burn more than the account owns", "Failed to capture too big burns on an account")
    }

    let totalSupply = await devToken.totalSupply();
    try {
      await devToken.burn(accounts[1], initial_balance - 50);
    }catch(error){
      assert.fail(error);
    }

    let balance = await devToken.balanceOf(accounts[1]);

    assert.equal(balance.toNumber(), initial_balance-50, "Burning 50 should reduce users balance")

    let newSupply = await devToken.totalSupply();

    assert.equal(newSupply.toNumber(), totalSupply.toNumber()-50, "Total supply not properly reduced")
  })

  it("transfering tokens", async() => {
    devToken = await DevToken.deployed();

    let initial_balance = await devToken.balanceOf(accounts[1]);

    await devToken.transfer(accounts[1], 100);
    
    let after_balance = await devToken.balanceOf(accounts[1]);

    assert.equal(after_balance.toNumber(), initial_balance.toNumber()+100, "Balance should have increased on reciever")

    let account2_initial_balance = await devToken.balanceOf(accounts[2]);

    await devToken.transfer(accounts[2], 20, { from: accounts[1]});
    let account2_after_balance = await devToken.balanceOf(accounts[2]);
    let account1_after_balance = await devToken.balanceOf(accounts[1]);

    assert.equal(account1_after_balance.toNumber(), after_balance.toNumber()-20, "Should have reduced account 1 balance by 20");
    assert.equal(account2_after_balance.toNumber(), account2_initial_balance.toNumber()+20, "Should have givne accounts 2 20 tokens");

    try {
      await devToken.transfer(accounts[2], 2000000000000, { from:accounts[1]});
    }catch(error){
      assert.equal(error.reason, "DevToken: cant transfer more than your account holds");
    }
  })

  it ("allow account some allowance", async() => {
    devToken = await DevToken.deployed();

    try{
      await devToken.approve('0x0000000000000000000000000000000000000000', 100);    
    }catch(error){
      assert.equal(error.reason, 'DevToken: approve cannot be to zero address', "Should be able to approve zero address");
    }

    try{
      await devToken.approve(accounts[1], 100);    
    }catch(error){
      assert.fail(error); // shold not fail
    }

    let allowance = await devToken.allowance(accounts[0], accounts[1]);
    assert.equal(allowance.toNumber(), 100, "Allowance was not correctly inserted");
  })

  it("transfering with allowance", async() => {
    devToken = await DevToken.deployed();

    try{
      await devToken.transferFrom(accounts[0], accounts[2], 200, { from: accounts[1] } );
    }catch(error){
      assert.equal(error.reason, "DevToken: You cannot spend that much on this account", "Failed to detect overspending")
    }

    let init_allowance = await devToken.allowance(accounts[0], accounts[1]);

    console.log("init balalnce: ", init_allowance.toNumber())
    
    try{
      let worked = await devToken.transferFrom(accounts[0], accounts[2], 50, {from:accounts[1]});
    }catch(error){
      assert.fail(error);
    }

    let allowance = await devToken.allowance(accounts[0], accounts[1]);
    assert.equal(allowance.toNumber(), 50, "The allowance should have been decreased by 50")
  })
});