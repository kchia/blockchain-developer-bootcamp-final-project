// --Are commented to the specs described by NatSpec Solidity documentation: https://docs.soliditylang.org/en/latest/natspec-format.html
// --Use at least two design patterns from the "Smart Contracts" section: https://docs.google.com/document/d/1tthsXLlv5BDXEGUfoP6_MAsL_8_T0sRBNQs_1OnPxak/edit
// --Protect against two attack vectors from the "Smart Contracts" section with its the SWC number: https://docs.google.com/document/d/1tthsXLlv5BDXEGUfoP6_MAsL_8_T0sRBNQs_1OnPxak/edit
// --Inherits from at least one library or interface
// --Can be easily compiled, migrated and tested? YES
// -- use Chainlink Keepers to pull in data and make NFTs dynamic

// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract DungeonsAndDragonsCharacter is ERC721URIStorage, VRFConsumerBase {
    AggregatorV3Interface internal priceFeed;
    bytes32 internal keyHash;
    uint256 internal fee;
    address public VRFCoordinator;
    address public linkToken;

    struct Character {
        int256 strength;
        uint256 dexterity;
        uint256 constitution;
        uint256 intelligence;
        uint256 wisdom;
        uint256 charisma;
        uint256 experience;
        string name;
    }

    Character[] public characters;

    mapping(bytes32 => string) public requestToCharacterName;
    mapping(bytes32 => address) public requestToSender;

    event RequestedCharacter(bytes32 indexed requestId);

    constructor(
        address _VRFCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        address _priceFeed
    )
        public
        VRFConsumeBase(_VRFCoordinator, _linkToken)
        ERC721("DungeonsAndDragonsCharacter", "D&D")
    {
        VRFCoordinator = _VRFCoordinator;
        priceFeed = _priceFeed;
        linkToken = _linkToken;
        keyHash = _keyHash;
        fee = 0.1 * 10**10; // 0.1 LINK
    }

    function requestNewRandomCharacter(string memory name)
        public
        returns (bytes32)
    {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        bytes32 requestId = requestRandomness(keyHash, fee);

        requestToCharacterName[requestId] = name;
        requestToSender[requestId] = msg.sender;
        emit RequestedCharacter(requestId);
        return requestId;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        uint256 id = characters.length;
        int256 strength = getLatestPrice() / 1000000000;
        uint256 dexterity = randomNumber % 100;
        uint256 constitution = getRandomNumber(randomNumber, 1);
        uint256 intelligence = getRandomNumber(randomNumber, 2);
        uint256 wisdom = getRandomNumber(randomNumber, 3);
        uint256 charisma = getRandomNumber(randomNumber, 4);
        uint256 experience = 0;

        Character memory character = Character(
            strength,
            dexterity,
            constitution,
            intelligence,
            wisdom,
            charisma,
            experience,
            requestToCharacterName[requestId]
        );

        characters.push(character);
        _safeMint(requestToSender[requestId], id);
    }

    function getLatestPrice() public view returns (int256) {
        (, int256 price) = priceFeed.latestRoundData();
        return price;
    }

    function getNumberOfCharacters() public view returns (uint256) {
        return characters.length;
    }

    function getRandomNumber(uint256 _randomNumber, uint256 _otherRandomNumber)
        private
        pure
        returns (uint256)
    {
        return
            uint256(keccak256(abi.encode(_randomNumber, _otherRandomNumber))) %
            100;
    }
}
