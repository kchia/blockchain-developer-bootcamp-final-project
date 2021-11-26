import { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import {
  selectEthBalance,
  selectStatus,
  fetchEthBalance,
} from "../../features/auth/auth.slice";

export default function useEth() {
  const { chainId, active, activate, deactivate, library, account } =
    useWeb3React();
  const dispatch = useDispatch();
  const ethBalance = useSelector(selectEthBalance);
  const status = useSelector(selectStatus);
  const handleError = useErrorHandler();

  useEffect(() => loadEthBalance(), [active, account]);

  async function loadEthBalance() {
    try {
      if (library && active && account) {
        await dispatch(
          fetchEthBalance({
            library,
            active,
            account,
          })
        ).unwrap();
      }
    } catch ({ message }) {
      handleError(message);
    }
  }

  return {
    active,
    account,
    activate,
    chainId,
    deactivate,
    ethBalance,
    status,
    UnsupportedChainIdError,
  };
}
