import { useEffect } from "react";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import ABI from "../../abis/EllipticalArtNFTContract.abi.json";
import { STATUS, NFT_CONTRACT_ADDRESS } from "../../common/constants";
import { ErrorFallback, Loader } from "../../common/core";
import { useContract } from "../../common/hooks";
import { logError } from "../../common/utils";
import { Auth, EllipticalsList } from "../../features";

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
  const { active } = useWeb3React();

  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchEllipticalsCount({ contract, active })).unwrap();
      } catch (error) {
        handleError(error);
      }
    })();
  }, [active, contract, dispatch, handleError]);

  const content =
    fetchEllipticalsCountStatus === STATUS.loading ? (
      <Loader />
    ) : active ? (
      <ErrorBoundary
        children={
          <>
            <h2 className={styles.title}>
              Browse all {ellipticalsCount} minted Elliptical art NFT...
            </h2>
            <EllipticalsList />
          </>
        }
        FallbackComponent={ErrorFallback}
        onReset={() => dispatch(ellipticalsReset())}
        onError={logError}
      />
    ) : (
      <>
        <h2>
          Connect your wallet to browse all minted ellipticals on the Rinkeby
          network
        </h2>
        <Auth />
      </>
    );

  return <section className={styles.container}>{content}</section>;
}
