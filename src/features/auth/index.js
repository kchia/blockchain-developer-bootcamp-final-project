import { useErrorHandler } from "react-error-boundary";
import { formatEther } from "@ethersproject/units";

import { STATUS } from "../../common/constants";
import { Button, Loader } from "../../common/core";
import { useEth } from "../../common/hooks";
import { shortenAddress } from "../../common/utils";

import { injected } from "./auth.connectors";

export default function Auth() {
  const {
    activate,
    active,
    deactivate,
    account,
    ethBalance,
    status,
    UnsupportedChainIdError,
  } = useEth();

  const handleError = useErrorHandler();

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
            ? "Only Rinkeby is supported."
            : `Sorry, we're having trouble activating the wallet: ${error.message}`
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
      <Button text="connect to web3" handleClick={handleConnectButtonClick} />
    ) : (
      <>
        <p>Connected:{shortenAddress(account)}</p>
        <p>ETH balance:{balance}</p>
        <Button text="log out" handleClick={handleLogoutButtonClick} />
      </>
    );

  return <section>{content}</section>;
}
