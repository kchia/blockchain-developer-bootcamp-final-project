# Design Pattern Decisions

## Oracles

The `EllipticalArtNFT` contract uses the Chainlink VRF and Chainlink data feed to generate attributes for each elliptical art NFT.
## Inheritance and Interfaces

The `EllipticalArtNFT` contract inherits the OpenZeppelin `ERC721`, `ERC721URIStorage`, and `Ownable` contracts as well as Chainlink's `VRFConsumeBase` contract (to allow the contract to request verifiable randomness) and `AggregatorV3Interface` interface (to call Chainlink's data feed).


    