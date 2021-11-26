import { useEffect } from "react";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";

import ABI from "../../abis/BubbleArtNFTContract.abi.json";
import { STATUS, NFT_CONTRACT_ADDRESS } from "../../common/constants";
import { ErrorFallback, Loader } from "../../common/core";
import { useContract } from "../../common/hooks";
import { logError } from "../../common/utils";
import { BubblesList } from "../../features";

import {
  bubblesReset,
  fetchBubblesCount,
  selectBubblesCount,
  selectFetchBubblesCountStatus,
} from "../../features/bubbles/bubbles.slice";

import styles from "./bubbles.module.css";

export default function BubblesPage() {
  const bubblesCount = useSelector(selectBubblesCount);

  const fetchBubblesCountStatus = useSelector(selectFetchBubblesCountStatus);

  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const contract = useContract(NFT_CONTRACT_ADDRESS, ABI);

  useEffect(() => {
    (async () => {
      try {
        if (!!contract) {
          await dispatch(fetchBubblesCount(contract)).unwrap();
        }
      } catch (error) {
        handleError(error);
      }
    })();
  }, [contract, dispatch, handleError]);

  const content =
    fetchBubblesCountStatus === STATUS.loading ? (
      <Loader />
    ) : (
      <ErrorBoundary
        children={<BubblesList />}
        FallbackComponent={ErrorFallback}
        onReset={() => dispatch(bubblesReset())}
        onError={logError}
      />
    );

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        Browse all {bubblesCount} minted bubble art NFT...
      </h2>
      {content}
    </section>
  );
}
