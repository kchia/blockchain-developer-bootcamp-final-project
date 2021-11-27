// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract EllipticalArtNFT is ERC721URIStorage, VRFConsumerBase, Ownable {
    AggregatorV3Interface internal priceFeed;
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    address public VRFCoordinator;
    address public LinkToken;

    struct Elliptical {
        uint8 v1;
        uint8 v2;
        uint8 v3;
        uint8 alpha;
        uint8 x;
        uint8 y;
        uint8 w;
        uint8 h;
        string name;
    }

    Elliptical[] public ellipticals;

    mapping(bytes32 => string) public requestToEllipticalName;
    mapping(bytes32 => address) public requestToSender;
    mapping(bytes32 => uint256) requestToTokenId;

    event RequestedElliptical(bytes32 indexed requestId);

    constructor(
        address _VRFCoordinator,
        address _LinkToken,
        bytes32 _keyHash,
        address _priceFeed
    )
        VRFConsumerBase(_VRFCoordinator, _LinkToken)
        ERC721("EllipticalArtNFT", "EA")
    {
        VRFCoordinator = _VRFCoordinator;
        priceFeed = AggregatorV3Interface(_priceFeed);
        LinkToken = _LinkToken;
        keyHash = _keyHash;
        fee = 0.1 * 10**18; // 0.1 LINK
    }

    function requestNewRandomElliptical(
        string memory name,
        string memory description,
        string memory image
    ) public returns (bytes32) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Please fill contract with LINK"
        );
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestToEllipticalName[requestId] = name;
        requestToSender[requestId] = msg.sender;
        emit RequestedElliptical(requestId);
        return requestId;
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        _setTokenURI(tokenId, _tokenURI);
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

    function getEllipticalsCount() public view returns (uint256) {
        return ellipticals.length;
    }

    function getEllipticalOverView(uint256 tokenId)
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            characters[tokenId].name,
            uint256(characters[tokenId].strength) +
                characters[tokenId].dexterity +
                characters[tokenId].constitution +
                characters[tokenId].intelligence +
                characters[tokenId].wisdom +
                characters[tokenId].charisma,
            getLevel(tokenId),
            characters[tokenId].experience
        );
    }

    function getLatestPrice() public view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    function getRandomNumber(uint256 _randomNumber, uint256 _nonce)
        private
        pure
        returns (uint256)
    {
        return uint256(keccak256(abi.encode(_randomNumber, _nonce))) % 100;
    }

    function getCharacterStats(uint256 tokenId)
        public
        view
        returns (
            int256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            characters[tokenId].strength,
            characters[tokenId].dexterity,
            characters[tokenId].constitution,
            characters[tokenId].intelligence,
            characters[tokenId].wisdom,
            characters[tokenId].charisma,
            characters[tokenId].experience
        );
    }
}
