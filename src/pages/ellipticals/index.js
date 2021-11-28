import { useEffect } from "react";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";

import ABI from "../../abis/EllipticalArtNFTContract.abi.json";
import { STATUS, NFT_CONTRACT_ADDRESS } from "../../common/constants";
import { ErrorFallback, Loader } from "../../common/core";
import { useContract } from "../../common/hooks";
import { logError } from "../../common/utils";
import { EllipticalsList } from "../../features";

import {
  ellipticalsReset,
  fetchEllipticalsCount,
  selectEllipticalsCount,
  selectFetchEllipticalsCountStatus,
} from "../../features/ellipticals/ellipticals.slice";

import styles from "./ellipticals.module.css";

export default function EllipticalsPage() {
  const ellipticalsCount = useSelector(selectEllipticalsCount);

  const fetchEllipticalsCountStatus = useSelector(
    selectFetchEllipticalsCountStatus
  );

  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const contract = useContract(NFT_CONTRACT_ADDRESS, ABI);

  useEffect(() => {
    (async () => {
      try {
        if (!!contract) {
          await dispatch(fetchEllipticalsCount(contract)).unwrap();
        }
      } catch (error) {
        handleError(error);
      }
    })();
  }, []);

  const content =
    fetchEllipticalsCountStatus === STATUS.loading ? (
      <Loader />
    ) : (
      <ErrorBoundary
        children={<EllipticalsList />}
        FallbackComponent={ErrorFallback}
        onReset={() => dispatch(ellipticalsReset())}
        onError={logError}
      />
    );

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        Browse all {ellipticalsCount} minted Elliptical art NFT...
      </h2>
      {content}
    </section>
  );
}
