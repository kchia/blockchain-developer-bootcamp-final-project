import { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";

import ABI from "../../../abis/BubbleArtNFTContract.abi.json";
import { STATUS, NFT_CONTRACT_ADDRESS } from "../../../common/constants";
import { Loader } from "../../../common/core";
import { useContract } from "../../../common/hooks";
import {
  fetchBubbles,
  selectAllBubbles,
  selectFetchBubblesStatus,
} from "../../../features/bubbles/bubbles.slice";

import Bubble from "../view";

export default function BubblesList() {
  const bubbles = useSelector(selectAllBubbles);
  const fetchBubblesStatus = useSelector(selectFetchBubblesStatus);
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  const contract = useContract(NFT_CONTRACT_ADDRESS, ABI);

  useEffect(() => {
    (async () => {
      try {
        if (!!contract) {
          await dispatch(fetchBubbles(contract)).unwrap();
        }
      } catch (error) {
        handleError(error);
      }
    })();
  }, [contract, dispatch, handleError]);

  const content =
    fetchBubblesStatus === STATUS.loading ? (
      <Loader />
    ) : (
      bubbles.map((bubble, index) => (
        <li key={index}>
          <Bubble bubble={bubble} />
        </li>
      ))
    );
  return (
    <section>
      <ul>{content}</ul>
    </section>
  );
}
