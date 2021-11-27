import { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";

import ABI from "../../../abis/EllipticalArtNFTContract.abi.json";
import { STATUS, NFT_CONTRACT_ADDRESS } from "../../../common/constants";
import { Loader } from "../../../common/core";
import { useContract } from "../../../common/hooks";
import {
  fetchEllipticals,
  selectAllEllipticals,
  selectFetchEllipticalsStatus,
} from "../ellipticals.slice";

import Elliptical from "../view";

export default function EllipticalsList() {
  const ellipticals = useSelector(selectAllEllipticals);
  const fetchEllipticalsStatus = useSelector(selectFetchEllipticalsStatus);
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  const contract = useContract(NFT_CONTRACT_ADDRESS, ABI);

  useEffect(() => {
    (async () => {
      try {
        if (!!contract) {
          await dispatch(fetchEllipticals(contract)).unwrap();
        }
      } catch (error) {
        handleError(error);
      }
    })();
  }, [contract, dispatch, handleError]);

  const content =
    fetchEllipticalsStatus === STATUS.loading ? (
      <Loader />
    ) : (
      ellipticals.map((elliptical, index) => (
        <li key={index}>
          <Elliptical elliptical={elliptical} />
        </li>
      ))
    );
  return (
    <section>
      <ul>{content}</ul>
    </section>
  );
}
