import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useErrorHandler } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";

import ABI from "../../../abis/EllipticalArtNFTContract.abi.json";
import { NFT_CONTRACT_ADDRESS } from "../../../common/constants";
import { Button } from "../../../common/core";
import { useContract } from "../../../common/hooks";
import {
  mintRandomElliptical,
  selectMintRandomEllipticalStatus,
} from "../ellipticals.slice";
import EllipticalView from "../view";

export default function MintEllipticalArtForm() {
  const [formData, setFormData] = useState({
    image: "",
    description: "",
    name: "",
  });
  const { txHash, setTxHash } = useState("");
  const status = useSelector(selectMintRandomEllipticalStatus);
  const contract = useContract(NFT_CONTRACT_ADDRESS, ABI);
  const { chainId, library } = useWeb3React();
  const handleError = useErrorHandler();
  const dispatch = useDispatch();

  function handleChange({ target: { name, value } }) {
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (library) {
      const signer = library.getSigner();

      if (signer) {
        try {
          await dispatch(
            mintRandomElliptical({
              contract,
              signer,
              ...formData,
            })
          );

          // if (chainId && tx) {
          //   setTxHash(tx.hash);
          // }

          // await tx.wait();
          // setTxHash(undefined);
        } catch (error) {
          handleError(error);
        }
      }
    }

    setFormData({ image: "", description: "", name: "" });
  }

  return (
    <>
      <EllipticalView />
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="name">
              Name:
              <input
                id="name"
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                required
              />
            </label>
          </li>
          <li>
            <label htmlFor="description">
              Description:
              <textarea
                id="description"
                name="description"
                onChange={handleChange}
                value={formData.description}
                required
              />
            </label>
          </li>
          <li>
            <label htmlFor="image">
              Image:
              <textarea
                id="image"
                name="image"
                onChange={handleChange}
                value={formData.image}
                required
              />
            </label>
          </li>
        </ul>
        <h2>{txHash}</h2>
        <Button text="Mint an NFT" handleClick={handleSubmit} />
      </form>
    </>
  );
}
