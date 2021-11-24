import { useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { formatEther } from "@ethersproject/units";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import { STATUS } from "../../common/constants";
import { shortenAddress } from "../../common/utils";
import { Button, Loader } from "../../common/core";
import { useEth } from "../../common/hooks";

import { injected } from "./auth.connectors";

export default function Auth() {
  const { account, activate, active, deactivate } = useWeb3React();
  const { ethBalance, loadEthBalance, status } = useEth();
  const handleError = useErrorHandler();

  useEffect(() => {
    loadEthBalance();
  }, [active]);

  async function handleConnectButtonClick() {
    if (!window.ethereum) {
      handleError(
        new Error(
          "Looks like you don't have Metamask, you'll need it to use this app."
        )
      );
      return;
    }

    try {
      await activate(injected);
    } catch (error) {
      handleError(
        new Error(
          error instanceof UnsupportedChainIdError
            ? "Only Ropsten and Rinkeby supported."
            : `Sorry, we're having trouble activating the wallet: ${error}`
        )
      );
    }
  }

  async function handleLogoutButtonClick() {
    try {
      await deactivate();
    } catch (error) {
      handleError(new Error("Sorry, we're having trouble logging out."));
    }
  }

  const balance =
    (typeof ethBalance === "object" &&
      parseFloat(formatEther(ethBalance)).toPrecision(4)) ||
    ethBalance;

  const content =
    status === STATUS.loading ? (
      <Loader />
    ) : status === STATUS.idle && !active ? (
      <Button text="connect" handleClick={handleConnectButtonClick} />
    ) : (
      <>
        <h3>{shortenAddress(account)}</h3>
        <h3>{balance}</h3>
        <Button text="log out" handleClick={handleLogoutButtonClick} />
      </>
    );

  return <section>{content}</section>;
}
