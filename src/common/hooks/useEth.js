import { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";
import { useSelector, useDispatch } from "react-redux";

import {
  selectEthBalance,
  setEthBalance,
} from "../../features/auth/auth.slice";

export default function useEth() {
  const { active, library, account } = useWeb3React();
  const dispatch = useDispatch();
  const ethBalance = useSelector(selectEthBalance);
  const handleError = useErrorHandler();

  useEffect(() => fetchEthBalance(), []);

  async function fetchEthBalance() {
    try {
      const balance = library && (await library.getBalance(account));
      dispatch(
        setEthBalance(
          library && active && account
            ? parseFloat(formatEther(balance)).toPrecision(4)
            : "--"
        )
      );
    } catch (error) {
      handleError(error);
    }
  }

  return { ethBalance, fetchEthBalance };
}
