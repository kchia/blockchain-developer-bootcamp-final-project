// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// @title Contract for creating tradeable, randomly generated, and rare elliptical art
/// @author Hou Chia
/// @notice You can use this contract to generate tradeable, randomly generated, and rare elliptical art

contract EllipticalArtNFT is
    ERC721,
    ERC721URIStorage,
    VRFConsumerBase,
    Ownable
{
    AggregatorV3Interface internal priceFeed;

    /// @notice key hash.
    /// @dev public key used to generate randomness, set during contract initialization
    bytes32 internal keyHash;

    /// @notice fee required to fulfill a VRF request for generating a verifiably random number
    /// @dev Used as an input to the Chainlink VRF, set during contract initialization
    uint256 internal fee;

    /// @notice Chainlink VRFCoordinator address
    /// @dev Used as an input to the Chainlink VRF, set during contract initialization
    address public VRFCoordinator;

    /// @notice Chainlink token address at a given network
    /// @dev Used as an input to the Chainlink VRF, set during contract initialization
    address public LinkToken;

    /// @notice Cooldown period before an address can mint another elliptical
    /// @dev Used to ensure that no address can mint more than 1 elliptical within a day
    uint256 cooldownTime = 1 days;

    /// @notice The maximum number of ellipticals that can be created per address
    /// @dev Used to ensure that no address can mint more than 2 ellipticals
    uint8 maxPerAddress = 2;

    /// @notice The maximum number of ellipticals that can be created on this contract
    /// @dev This value is set during contract initialization, and cannot be updated
    uint8 maxSupply;

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
    mapping(address => uint32) addressToReadyTime;
    mapping(address => uint8) addressEllipticalCount;
    mapping(uint256 => address) ellipticalApprovals;
    mapping(uint256 => address) public ellipticalToOwner;

    /// @notice Emitted when a user requests a new elliptical
    /// @param requestId request id
    event RequestedElliptical(bytes32 indexed requestId);

    modifier requireSufficientLink() {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Please fill contract with LINK"
        );
        _;
    }

    modifier requireIsBelowMaxPerAddress() {
        require(
            addressEllipticalCount[_msgSender()] < maxPerAddress,
            "An address cannot mint more than two ellipticals!"
        );
        _;
    }

    modifier requireIsBelowMaxSupply() {
        require(
            getEllipticalsCount() == maxSupply,
            "No more ellipticals can be minted!"
        );
        _;
    }

    modifier requireIsReady() {
        require(
            _isReady(_msgSender()),
            "An address cannot mint more than one elliptical within a 24 hour period!"
        );
        _;
    }

    modifier requireIsOwnerOf(uint256 _tokenId) {
        require(
            ellipticalToOwner[_tokenId] == _msgSender(),
            "Only the owner can approve a token transfer!"
        );
        _;
    }

    constructor(
        address _VRFCoordinator,
        address _LinkToken,
        bytes32 _keyHash,
        address _priceFeed,
        uint8 _maxSupply
    )
        VRFConsumerBase(_VRFCoordinator, _LinkToken)
        ERC721("EllipticalArtNFT", "EA")
    {
        VRFCoordinator = _VRFCoordinator;
        priceFeed = AggregatorV3Interface(_priceFeed);
        LinkToken = _LinkToken;
        keyHash = _keyHash;
        fee = 0.1 * 10**18; // 0.1 LINK
        maxSupply = _maxSupply;
    }

    /// @notice Request a new elliptical
    /// @dev requestRandomness() makes a request to the Chainlink oracle for a verifiably random number
    /// @param _name a name for the elliptical
    /// @return request id associated with the VRF request
    function requestNewRandomElliptical(string memory _name)
        public
        requireSufficientLink
        requireIsBelowMaxSupply
        requireIsBelowMaxPerAddress
        requireIsReady
        returns (bytes32)
    {
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestToEllipticalName[requestId] = _name;
        requestToSender[requestId] = _msgSender();
        emit RequestedElliptical(requestId);
        return requestId;
    }

    /// @notice Return the URI for a given token
    /// @param _tokenId id for the token
    /// @return the token URI, which resolves to a JSON containing the token metadata
    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        return tokenURI(_tokenId);
    }

    /// @notice Set the URI where the token metadata is stored
    /// @param tokenId id for the token
    /// @param _tokenURI the token URI, which resolves to a JSON containing the token metadata
    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        _setTokenURI(tokenId, _tokenURI);
    }

    /// @dev The function that receives the verifiable random number and does something with it
    /// @param _requestId id identifying the VRF request
    /// @param _randomNumber random number generated by the Chainlink VRF
    function fulfillRandomness(bytes32 _requestId, uint256 _randomNumber)
        internal
        override
    {
        uint256 id = ellipticals.length;
        uint256 v1 = uint256(_getLatestPrice()) % 255;
        uint256 v2 = _getRandomNumber(_randomNumber, 1, 255);
        uint256 v3 = _getRandomNumber(_randomNumber, 2, 255);
        uint256 alpha = _getRandomNumber(_randomNumber, 3, 255);
        uint256 x = _getRandomNumber(_randomNumber, 4, 500);
        uint256 y = _getRandomNumber(_randomNumber, 5, 500);
        uint256 w = _getRandomNumber(_randomNumber, 6, 100);
        uint256 h = _getRandomNumber(_randomNumber, 7, 100);

        Elliptical memory elliptical = Elliptical(
            requestToEllipticalName[_requestId],
            v1,
            v2,
            v3,
            alpha,
            x,
            y,
            w,
            h
        );
        address _sender = requestToSender[_requestId];
        ellipticals.push(elliptical);
        ellipticalToOwner[id] = _msgSender();
        addressEllipticalCount[_sender]++;
        _triggerCooldown(_sender);
        _safeMint(_sender, id);
    }

    /// @notice Get the total number of ellipticals already minted in the contract
    /// @return count of ellipticals
    function getEllipticalsCount() public view returns (uint256) {
        return ellipticals.length;
    }

    /// @notice Get the attributes for an elliptical image
    /// @param _tokenId token id for the desired elliptical
    /// @return attributes of the elliptical image
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

    /// @notice Transfer a token from one address to another
    /// @param _from the address to transfer from
    /// @param _to the address to transfer to
    /// @param _tokenId the token to transfer
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        require(
            ellipticalToOwner[_tokenId] == _msgSender() ||
                ellipticalApprovals[_tokenId] == _msgSender()
        );
        _transfer(_from, _to, _tokenId);
    }

    /// @notice Approve an address to transfer a token on the owner's behalf
    /// @param _approved the address to approve
    /// @param _tokenId the token to give approval for
    function approve(address _approved, uint256 _tokenId)
        public
        override
        requireIsOwnerOf(_tokenId)
    {
        ellipticalApprovals[_tokenId] = _approved;
        emit Approval(_msgSender(), _approved, _tokenId);
    }

    /// @notice Return the token URI for a given token
    /// @param _tokenId the token id
    /// @return the token URI
    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }

    /// @notice Transfer a token from one address to another
    /// @dev This function is called by the public transferFrom function
    /// @param _from the address to transfer from
    /// @param _to the address to transfer to
    /// @param _tokenId the token to transfer
    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal override {
        addressEllipticalCount[_to]++;
        addressEllipticalCount[_msgSender()]--;
        ellipticalToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    /// @notice Burn a token
    /// @param _tokenId the id of the token to be burnt
    function _burn(uint256 _tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(_tokenId);
    }

    /// @notice Get the latest price feed for a coin
    /// @dev Using Chainlink price feeds, the price feed address to use is provided during contract initialization
    /// @return most recent round of price data
    function _getLatestPrice() private view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    /// @notice Generate a random number in a given range
    /// @dev Feed in the Chainlink VRF random number
    /// @param _randomNumber random number
    /// @param _nonce nonce or seed
    /// @param _range the returned value should be in the specified range
    /// @return a random number in a given range
    function _getRandomNumber(
        uint256 _randomNumber,
        uint256 _nonce,
        uint256 _range
    ) private pure returns (uint256) {
        return uint256(keccak256(abi.encode(_randomNumber, _nonce))) % _range;
    }

    /// @notice Trigger a cooldown period for each address after every mint
    /// @dev keep in mind block.timestamp is susceptible to miner manipulation
    /// @param _address the address to set a cooldown period for
    function _triggerCooldown(address _address) private {
        addressToReadyTime[_address] = uint32(block.timestamp + cooldownTime);
    }

    /// @notice Check whether an address is ready to mint
    /// @dev Keep in mind block.timestamp is susceptible to miner manipulation
    /// @param _address the address to check
    /// @return true if the address is ready to mint; otherwise, return false
    function _isReady(address _address) internal view returns (bool) {
        return (addressToReadyTime[_address] == 0 ||
            addressToReadyTime[_address] <= block.timestamp);
    }
}
