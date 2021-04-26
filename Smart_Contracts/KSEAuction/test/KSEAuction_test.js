const assert = require('assert')
const KSEAuction = artifacts.require("KSEAuction");
const AuctionFactory = artifacts.require("AuctionFactory");

const KSEAToken = artifacts.require("KSEAToken");
const KSEAirdrop = artifacts.require("KSEAirdrop");

let accounts;
let token;
let factory;
let auction;
let auctionMade;
let auctionAddr;
let airdrop;


beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  token = await KSEAToken.deployed();

  factory = await AuctionFactory.deployed();
  auctionMade = await factory.createAuction("test", token.address);
  auctionAddr = await factory.getAuctionAddr("test");
  auction = await KSEAuction.at(auctionAddr);
  airdrop = await KSEAirdrop.deployed();
});

contract("KSEAuction", async () => {
  //1. shows accounts[1]'s total bid correctly(bidding system works correctly)
  //2. shows now highestBid
  //3. shows now highestBidder
  //4. shows how many coin do I(accounts[1]) need to add to be a highestBidder
  //5. testing enough amount to bid(bidding amount > 0)
  //6. testing new highest Bidder and new highest bidding amount shows correctly.
  //7. auctionEnd works correctly.

  it ("shows my(accounts[1]) total bid amount", async() => {
    await token.approve(airdrop.address, 10000, {from: accounts[0]});
    await airdrop.registerBoardMember(accounts[0], {from:accounts[0]});
    await airdrop.distributeDobbyTokens([accounts[1], accounts[2], accounts[3]], 1000, {from: accounts[0]});
    await token.approve(auctionAddr, 10000, {from: accounts[1]});
    await auction.bid(10, {from: accounts[1]});
    let bid1 = await auction.highestBid();
    assert.equal(10, bid1);
  });

  it ("shows now highestBid amount and highestBidder", async() => {
    await token.approve(auction.address, 10000, {from: accounts[2]});
    await auction.bid(15, {from: accounts[2]});
    await token.approve(auction.address, 10000, {from: accounts[3]});
    await auction.bid(30, {from: accounts[3]});
    let highBid1 = await auction.highestBid();
    assert.equal(30, highBid1);
    let highBidder1 = await auction.highestBidder();
    //name? or address?
    assert.equal(accounts[3], highBidder1)
  });

  it ("when bidding amount is less or equal than 0, it can't be processed", async() => {
    let err = null;
    try {
        await auction.bid(0, {from: accounts[1]});
    } catch(e) {
        err = e;
    }
    assert.ok(err instanceof Error) 
  });

  it ("new highestBid and new highestBid amount is updated", async() => {
    await token.approve(auction.address, 10000, {from: accounts[2]});
    await auction.bid(15, {from: accounts[2]});
    await token.approve(auction.address, 10000, {from: accounts[3]});
    await auction.bid(30, {from: accounts[3]});
    let highBid1 = await auction.highestBid();
    assert.equal(30, highBid1);
    let highBidder1 = await auction.highestBidder();
    //name? or address?
    assert.equal(accounts[3], highBidder1)

    await token.approve(auction.address, 10000, {from: accounts[2]});
    await auction.bid(100, {from: accounts[2]});
    await token.approve(auction.address, 10000, {from: accounts[3]});
    await auction.bid(50, {from: accounts[3]});
    let highBid_2 = await auction.highestBid();
    assert.equal(115, highBid_2);
    let highbidder2 = await auction.highestBidder();
    //name? or address?
    assert.equal(accounts[2], highbidder2)
  });

  it ("auctionEnd function test", async () => {
    setTimeout(auction.auctionEnd, 10000);
  });

  /*
  it("is able to pause and unpause fund activity", async function () {
        await auction.pause()

        try {
            await auction.sendTransaction({ value: 1e+18, from: donor })
            assert.fail()
        } catch (error) {
            assert(error.toString().includes('invalid opcode'), error.toString())
        }
        const auctionAddress = await auction.address
        assert.equal(web3.eth.getBalance(auctionAddress).toNumber(), 0)

        await auction.unpause()
        await auction.sendTransaction({ value: 1e+18, from: donor })
        assert.equal(web3.eth.getBalance(auctionAddress).toNumber(), 1e+18)
    })
    */
  /* it ("highestBid function test", async () => {
    await token.approve(airdrop.address, 10000, {from: accounts[0]});
    await airdrop.registerBoardMember(accounts[0], {from:accounts[0]});
    await airdrop.distributeDobbyTokens([accounts[1], accounts[2], accounts[3]], 100, {from: accounts[0]});


    await token.approve(auction.address, 10000, {from: accounts[1]});
    await auction.bid(10, {from: accounts[1]});
    let highBid1 = await auction.highestBid();
    assert.equal(10, highBid1);
    await token.approve(auction.address, 10000, {from: accounts[2]});
    await auction.bid(15, {from: accounts[2]});
    await token.approve(auction.address, 10000, {from: accounts[3]});
    await auction.bid(30, {from: accounts[3]});
    let highBid2 = await auction.highestBid();
    assert.equal(30, highBid2);
  });
  */
});
