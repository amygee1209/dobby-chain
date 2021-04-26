const assert = require('assert');
const KSEAToken = artifacts.require("KSEAToken");
const KSEAirdrop = artifacts.require("KSEAirdrop");

let accounts;
let airdrop;
let token;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    token = await KSEAToken.deployed();
    airdrop = await KSEAirdrop.deployed(token.address);
});

contract("KSEAirdrop", async () => {
    it("should register board member", async () => {
        await airdrop.registerBoardMember(accounts[0], {from:accounts[0]});

        let board = await airdrop.isBoardMember(accounts[0]);

        assert.equal(board,true);
    })

    it("accounts[0] is the owner", async () => {
        let owner = await airdrop.owner();
        assert.equal(owner, accounts[0]);
    })

    it("balance of accounts[0]", async () => {
        let bal0 = await token.balanceOf(accounts[0]);
        assert.equal(bal0, 10000);
    })

    it("distributeTokens", async () => { //parameter check
       await token.approve(airdrop.address, 100);
       await airdrop.distributeDobbyTokens([accounts[1], accounts[2], accounts[3]], 5, {from: accounts[0]});

       let bal1 = await token.balanceOf(accounts[1]);
       let bal1Num = await parseFloat(bal1);
       let bal2 = await token.balanceOf(accounts[2]);
       let bal2Num = await parseFloat(bal2);
       let bal3 = await token.balanceOf(accounts[3]);
       let bal3Num = await parseFloat(bal3);

       assert.equal(bal1Num, 5);
       assert.equal(bal2Num, 5);
       assert.equal(bal3Num, 5);
    });


    it("distributeEther", async () => { //parameter check
       await airdrop.distributeEther([accounts[1], accounts[2]], {from: accounts[0], value: 2e18});

       let bal1 = await web3.eth.getBalance(accounts[1]);
       let bal1Num = await parseFloat(bal1);
       let bal2 = await web3.eth.getBalance(accounts[2]);
       let bal2Num = await parseFloat(bal2);

       assert.equal(bal1Num/1e18, 101);
       assert.equal(bal2Num/1e18, 101);
    });

    it("should register another board member", async () => {
        await airdrop.registerBoardMember(accounts[3]);
    
        let board = await airdrop.isBoardMember(accounts[3]);
    
        assert.equal(board,true);
    });

    it("distributeTokens to another board member", async () => { //parameter check
        await airdrop.distributeDobbyTokens([accounts[3]], 5, {from: accounts[0]});
 
        let bal3 = await token.balanceOf(accounts[3]);
        let bal3Num = await parseFloat(bal3);
 
        assert.equal(bal3Num, 10);
     });
    
    it("should deregister a board member", async () => {
        await airdrop.deregisterBoardMember(accounts[3]);
    
        let board = await airdrop.isBoardMember(accounts[3]);
    
        assert.equal(board,false);
    });

    it("try to distribute tokens by a non-board member.", async () => {
        try {
            await airdrop.distributeDobbyTokens([accounts[1], accounts[2]], 5, {from: accounts[3]});
        } catch {

        } finally {
            let bal1 = await token.balanceOf(accounts[1]);
            let bal1Num = await parseFloat(bal1);
            let bal2 = await token.balanceOf(accounts[2]);
            let bal2Num = await parseFloat(bal2);

            assert.equal(bal1Num, 5);
            assert.equal(bal2Num, 5);
        }
    });

    it("try to distribute more tokens than the approved", async () => {
        try {
            await airdrop.distributeDobbyTokens([accounts[1], accounts[2]], 45, {from: accounts[0]});
        } catch {

        } finally {
            let bal1 = await token.balanceOf(accounts[1]);
            let bal1Num = await parseFloat(bal1);
            let bal2 = await token.balanceOf(accounts[2]);
            let bal2Num = await parseFloat(bal2);

            assert.equal(bal1Num, 5);
            assert.equal(bal2Num, 5);
        }
    });
});
