// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.7.0;

// import "../../KSEAToken/contracts/SafeMath.sol";
// import "../../KSEAToken/contracts/EIP20Interface.sol";
import "../../KSEAToken/contracts/KSEAToken.sol";

contract Ownable {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        owner = newOwner;
    }
}

contract KSEAirdrop is Ownable {
    using SafeMath for uint256;

    // DobbyFactory private dobbyFactory;
    EIP20Interface private dobbyToken;
    // EIP20Interface private semesterToken;

    // Board Member mapping set up
    mapping(address => bool) private boardMembers;

    //event section
    event RegisteredBoardMember(
        address indexed _boardMember,
        bool indexed _flag
    );
    event DeregisteredBoardMember(
        address indexed _boardMember,
        bool indexed _flag
    );
    event TransferredToken(address indexed _to, uint256 _value);
    event FailedTransfer(address indexed _to, uint256 _value);
    event EtherTransferredToken(address indexed _to, uint256 _value);
    event EtherFailedTransfer(address indexed _to, uint256 _value);

    constructor(address _dobbyToken) public {
        dobbyToken = EIP20Interface(_dobbyToken);
    }

    // Register board member and emit Registered Board Member event
    function registerBoardMember(address _boardMember) external onlyOwner {
        // require(boardMembers[_boardMember] = false, "This member is already a board member!");
        boardMembers[_boardMember] = true;
        emit RegisteredBoardMember(_boardMember, true);
    }

    // Deregister board member and emit Registered Board Member event
    function deregisterBoardMember(address _boardMember) external onlyOwner {
        // require(boardMembers[_boardMember] = true, "This member is not a board member!");
        boardMembers[_boardMember] = false;
        emit DeregisteredBoardMember(_boardMember, false);
    }

    // Check if address corresponds to a Board Member
    // TODO: This is currently a hack using Solidity internals
    function isBoardMember(address _boardMember) public view returns (bool) {
        return boardMembers[_boardMember]; // Notice Solidity initializes maps with False
    }

    // Distribute tokens to a list of members
    function distributeDobbyTokens(address[] calldata _members, uint256 _value)
        external
    {
        require(
            isBoardMember(msg.sender) == true,
            "You are not the board member!"
        );
        for (uint256 i = 0; i < _members.length; i++) {
            sendInternallyDobby(_members[i], _value);
        }
    }

    function distributeEther(address payable[] calldata _members)
        external
        payable
    {
        require(
            isBoardMember(msg.sender) == true,
            "You are not the board member!"
        );
        for (uint256 i = 0; i < _members.length; i++) {
            _members[i].transfer(msg.value / _members.length);
            emit EtherTransferredToken(
                _members[i],
                msg.value / _members.length
            );
        }
    }

    // Distribute Dobby to one recipient
    function sendInternallyDobby(address recipient, uint256 tokensToSend)
        internal
    {
        if (recipient == address(0)) return;
        if (tokensAvailable() >= tokensToSend) {
            dobbyToken.transferFrom(msg.sender, recipient, tokensToSend);
            emit TransferredToken(recipient, tokensToSend);
        } else {
            emit FailedTransfer(recipient, tokensToSend);
        }
    }

    // Check how much tokens are currently available
    function tokensAvailable() internal view returns (uint256) {
        return dobbyToken.balanceOf(owner);
    }

    // function payMe() public payable {
    // }
}
