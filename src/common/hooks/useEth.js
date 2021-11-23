import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";
import { useAppContext } from "../../app/AppContext";

export default function useEth() {
  const { active, library, account } = useWeb3React();
  const { ethBalance, setEthBalance } = useAppContext();

  useEffect(() => {
    (async () =>
      setEthBalance(
        library && active && account
          ? parseFloat(
              formatEther(await library.getBalance(account))
            ).toPrecision(4)
          : "--"
      ))();
  }, [account, active, library, setEthBalance]);

  return { ethBalance };
}
