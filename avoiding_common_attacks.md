# Avoiding Common Attacks

## SWC-103 (Floating pragma)

The `EllipticalArtNFT` a uses specific compiler pragma `0.8.9` to avoid outdated compiler versions that could introduce bugs.

## SWC-101 (Integer Overflow and Underflow)

The `EllipticalArtNFT` uses a compiler pragma that has built-in support for SafeMath operations.
## Use Modifiers only for Validation

The `EllipticalArtNFT` uses modifiers that rely on `require` statements to validate data.

## SWC-115 (Authorization through tx.origin)

The `EllipticalArtNFT` avoids authorization through `tx.origin` and uses `msg.sender` instead, to avoid phishing attacks.