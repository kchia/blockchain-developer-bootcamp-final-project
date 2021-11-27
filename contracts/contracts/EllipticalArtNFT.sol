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
        string name;
        uint256 v1;
        uint256 v2;
        uint256 v3;
        uint256 alpha;
        uint256 x;
        uint256 y;
        uint256 w;
        uint256 h;
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

    function requestNewRandomElliptical(string memory name)
        public
        returns (bytes32)
    {
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
        uint256 id = ellipticals.length;
        uint256 v1 = uint256(getLatestPrice()) % 255;
        uint256 v2 = getRandomNumber(randomNumber, 1, 255);
        uint256 v3 = getRandomNumber(randomNumber, 2, 255);
        uint256 alpha = getRandomNumber(randomNumber, 3, 255);
        uint256 x = getRandomNumber(randomNumber, 4, 500);
        uint256 y = getRandomNumber(randomNumber, 5, 500);
        uint256 w = getRandomNumber(randomNumber, 6, 100);
        uint256 h = getRandomNumber(randomNumber, 7, 100);

        Elliptical memory elliptical = Elliptical(
            requestToEllipticalName[requestId],
            v1,
            v2,
            v3,
            alpha,
            x,
            y,
            w,
            h
        );

        ellipticals.push(elliptical);

        _safeMint(requestToSender[requestId], id);
    }

    function getEllipticalsCount() public view returns (uint256) {
        return ellipticals.length;
    }

    function getLatestPrice() public view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    function getRandomNumber(
        uint256 _randomNumber,
        uint256 _nonce,
        uint256 _range
    ) private pure returns (uint256) {
        return uint256(keccak256(abi.encode(_randomNumber, _nonce))) % _range;
    }

    function getEllipticalDimensions(uint256 _tokenId)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        Elliptical memory elliptical = ellipticals[_tokenId];
        return (
            elliptical.v1,
            elliptical.v2,
            elliptical.v3,
            elliptical.alpha,
            elliptical.x,
            elliptical.y,
            elliptical.w,
            elliptical.h
        );
    }
}
