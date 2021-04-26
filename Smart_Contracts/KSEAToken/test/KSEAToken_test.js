const assert = require('assert');
const KSEAToken = artifacts.require("KSEAToken");

let accounts;
let dobby;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    dobby = await KSEAToken.deployed();
});

contract("KSEAToken", async () => {
    it("should send total supply of tokens to contract deployer's wallet", async () => {
       let bal = await dobby.balanceOf(accounts[0]);
       assert.equal(10000, bal);
    });

    it ("should show correct name", async () => {
        let name = await dobby.name();
        assert.equal("KSEA DOBBY Token", name);
    });

    it ("should show correct symbol", async () => {
        let symbol = await dobby.symbol();
        assert.equal("DOBBY", symbol);
    });

    it ("should transfer 10 tokens from accounts[0] to accounts[1]", async () => {
        await dobby.transfer(accounts[1], 10, {from: accounts[0]});
        let bal = await dobby.balanceOf(accounts[1]);
        assert.equal(10, bal);
    });

    it ("should let accounts[0] approve accounts[1] to send 10 tokens to accounts[2]", async () => {
        await dobby.approve(accounts[1], 10, {from: accounts[0]});
        let allowance = await dobby.allowance(accounts[0], accounts[1]);
        assert.equal(10, allowance);
    });

    it ("should correctly let accounts[1] to send 10 tokens from accounts[0] to accounts[2]", async () => {
        await dobby.transferFrom(accounts[0], accounts[2], 10, {from: accounts[1]});
        let bal = await dobby.balanceOf(accounts[2]);
        assert.equal(10, bal);
    });

    it ("should show correct balance and allowance", async () => {
        let bal0 = await dobby.balanceOf(accounts[0]);
        let bal1 = await dobby.balanceOf(accounts[1]);
        let bal2 = await dobby.balanceOf(accounts[2]);
        let allowance = await dobby.allowance(accounts[0], accounts[1]);

        assert.equal(9980, bal0);
        assert.equal(10, bal1);
        assert.equal(10, bal2);
        assert.equal(0, allowance);
    });

    it("testing when not enough balance. should not change balances.", async () => {
        try {
            await dobby.transfer(accounts[2], 50, {from: accounts[1]});
        } catch(e) {

        } finally {
            let bal1 = await dobby.balanceOf(accounts[1]);
            let bal2 = await dobby.balanceOf(accounts[2]);

            assert.equal(10, bal1);
            assert.equal(10, bal2);
        }
    });

    it ("testing when not enough allowance. should not change balances", async () => {
        await dobby.approve(accounts[1], 10, {from: accounts[0]});
        try {
            await dobby.transferFrom(accounts[0], accounts[2], 50, {from: accounts[1]});
        } catch(e) {

        } finally {
            let bal0 = await dobby.balanceOf(accounts[0]);
            let bal1 = await dobby.balanceOf(accounts[1]);
            let bal2 = await dobby.balanceOf(accounts[2]);
    
            assert.equal(9980, bal0);
            assert.equal(10, bal1);
            assert.equal(10, bal2);
        }
    });

    it ("should correctly let accounts[1] to send 10 tokens from accounts[0] to accounts[1] itself", async () => {
        await dobby.transferFrom(accounts[0], accounts[1], 10, {from: accounts[1]});
        let bal0 = await dobby.balanceOf(accounts[0]);
        let bal1 = await dobby.balanceOf(accounts[1]);

        assert.equal(9970, bal0);
        assert.equal(20, bal1);
    })
});