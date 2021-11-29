import { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import ABI from "../../../abis/EllipticalArtNFTContract.abi.json";
import { STATUS, NFT_CONTRACT_ADDRESS } from "../../../common/constants";
import { Loader } from "../../../common/core";
import { useContract } from "../../../common/hooks";
import {
  fetchEllipticals,
  selectAllEllipticals,
  selectFetchEllipticalsStatus,
} from "../ellipticals.slice";

import EllipticalView from "../view";

import styles from "./list.module.css";

export default function EllipticalsList() {
  const ellipticals = useSelector(selectAllEllipticals);
  const fetchEllipticalsStatus = useSelector(selectFetchEllipticalsStatus);
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  const contract = useContract(NFT_CONTRACT_ADDRESS, ABI);
  const { active } = useWeb3React();

  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchEllipticals({ contract, active })).unwrap();
      } catch (error) {
        handleError(error);
      }
    })();
  }, [active, contract, dispatch, handleError]);

  const content =
    fetchEllipticalsStatus === STATUS.loading ? (
      <Loader />
    ) : (
      ellipticals.map((elliptical, index) => (
        <li key={index}>
          <EllipticalView elliptical={elliptical} />
        </li>
      ))
    );
  return (
    <section>
      <ul className={styles.list}>{content}</ul>
    </section>
  );
}
