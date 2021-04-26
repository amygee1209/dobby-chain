// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.7.0;

import "../../KSEAToken/contracts/KSEAToken.sol";
import "../../KSEAirdrop/contracts/KSEAirdrop.sol";


/**
=== RULE OF THE AUCTION ===
1. Blind Auction: The highest Bid is visible but becomes invisible at the last 1 hour.
2. There is no entry fee to enter the auction
3. There is no Bid Limit!
4. You cannot withdraw you bids. You can only add on more bids.
 */

contract KSEAuction is Ownable {
    using SafeMath for uint256;

    EIP20Interface private dobbyToken;

    uint256 public highestBid;
    uint256 public totalBid;
    address public highestBidder;
    bool private paused;
    bool ended;

    // maps address to user's total bid
    mapping(address => uint256) public bids;

    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    constructor(
        address _dobbyToken,
        address _owner
    ) public {
        dobbyToken = EIP20Interface(_dobbyToken);
        owner = _owner;
        paused = false;
    }

    /*
    Control the execution state of the contract.
    */
    modifier whenPaused() {
        require(paused, "Auction In Progress!");
        _;
    }

    modifier whenUnpaused() {
        require(!paused, "Auction Not In Progress!");
        _;
    }

    function _pause() public onlyOwner whenUnpaused {
        paused = true;
    }

    function _unpause() public onlyOwner whenPaused {
        paused = false;
    }

    /**
    Bid Function handles the token transaction from user's wallet to this smart contract. If the user already has bids staked in the contract, the new bids gets added on to their total bids.
     */
    function bid(uint256 _amount) public whenUnpaused {
        require(_amount > 0, "The amount must be greater than 0.");

        // update the highest bid and bidder
        if (bids[msg.sender] + _amount > highestBid) {
            highestBidder = msg.sender;
            highestBid = bids[msg.sender] + _amount;

            emit HighestBidIncreased(msg.sender, _amount);
        }

        // transaction
        totalBid += _amount;
        bids[msg.sender] += _amount;
        dobbyToken.transferFrom(msg.sender, address(this), _amount);
    }

    /// End the auction and send the highest bid
    /// to the beneficiary.
    function auctionEnd() public onlyOwner whenPaused {
        // 1. Conditions
        require(!ended, "auctionEnd has already been called.");

        // 2. Effects
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // 3. Interaction
        // dobbyToken.transferFrom(address(this), owner, highestBid);
        dobbyToken.transferFrom(address(this), owner, totalBid);
    }

    //returns the total bids staked in this smart contract
    function getTotalBids() public view returns (uint256) {
        return dobbyToken.balanceOf(address(this));
    }

    //returns the user's current bid
    function getBid(address bidder) public view returns (uint256) {
        return bids[bidder];
    }

    //returns the current highest bid
    function getHighestBid() public view returns (uint256) {
        return highestBid;
    }

    //returns the highest bidder's address
    function getHighestBidder() public view returns (address) {
        return highestBidder;
    }
}
