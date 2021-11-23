import { useEffect } from "react";
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

  useEffect(() => {
    (async () => {
      const balance = await library.getBalance(account);
      dispatch(
        setEthBalance(
          library && active && account
            ? parseFloat(formatEther(balance)).toPrecision(4)
            : "--"
        )
      );
    })();
  }, []);

  return { ethBalance };
}
