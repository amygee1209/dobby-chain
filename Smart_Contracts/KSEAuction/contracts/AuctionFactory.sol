pragma solidity >=0.5.0 <0.7.0;

import "./KSEAuction.sol";

contract AuctionFactory {
    address addr;

    struct AuctionItem {
        string name;
        //uint256 entryFee;
        address auctionAddr;
    }
    mapping(string => AuctionItem) private auctions;

    function createAuction(
        string calldata _name,
        //uint256 _entryFee,
        //uint256 _biddingTime,
        address _dobbyToken
    ) external returns (address) {
        KSEAuction k = new KSEAuction(
            //_biddingTime,
            //_entryFee,
            _dobbyToken,
            msg.sender
        );
        addr = address(k);
        auctions[_name].name = _name;
        //auctions[_name].entryFee = _entryFee;
        auctions[_name].auctionAddr = addr;
        return addr;
    }

    function getAuctionAddr(string calldata _name)
        external
        view
        returns (address)
    {
        return auctions[_name].auctionAddr;
    }

    function getItemName(string calldata _name)
        external
        view
        returns (string memory)
    {
        return auctions[_name].name;
    }
/*
    function getEntryFee(string calldata _name)
        external
        view
        returns (uint256)
    {
        return auctions[_name].entryFee;
    }
    */
}
