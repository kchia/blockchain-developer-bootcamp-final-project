import { useState } from "react";
import ABI from "../../abis/BubbleArtNFTContract.abi.json";
import { Button } from "../../common/core";
import { useContract } from "../../common/hooks";
import { useWeb3React } from "@web3-react/core";
export default function Mint() {
  const contract = useContract(
    "0xF96bB6800E858b44150487e28C0DffdB1E7AaD41",
    ABI
  );
  const { chainId, library } = useWeb3React();
  const { txHash, setTxHash } = useState("");

  async function handleMintButtonClick() {
    if (library) {
      const signer = library.getSigner();

      if (signer) {
        try {
          const tx = await contract
            .connect(signer)
            .requestNewRandomCharacter("Hou");

          if (chainId && tx) {
            setTxHash(tx.hash);
          }

          await tx.wait();
          setTxHash(undefined);
        } catch (error) {
          alert(error.message);
        }
      }
    }
  }
  return (
    <>
      <h2>{txHash}</h2>
      <Button text="Mint an NFT" handleClick={handleMintButtonClick} />
    </>
  );
}
