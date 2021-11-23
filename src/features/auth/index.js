import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useErrorHandler } from "react-error-boundary";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import { STATUS } from "../../common/constants";
import { shortenAddress } from "../../common/utils";
import { Button, Loader } from "../../common/core";
import { useEth } from "../../common/hooks";

import { injected } from "./auth.connectors";

export default function Auth() {
  const [status, setStatus] = useState(STATUS.idle);
  const { account, activate, active, deactivate } = useWeb3React();
  const history = useHistory();
  const handleError = useErrorHandler();
  const { ethBalance, fetchEthBalance } = useEth();

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
      setStatus(STATUS.loading);
      await activate(injected);
      await fetchEthBalance();
    } catch (error) {
      handleError(
        new Error(
          error instanceof UnsupportedChainIdError
            ? "Only Ropsten and Rinkeby supported."
            : `Sorry, we're having trouble activating the wallet: ${error}`
        )
      );
    } finally {
      setStatus(STATUS.idle);
    }
  }

  async function handleLogoutButtonClick() {
    try {
      await deactivate();
      history.push("/");
    } catch (error) {
      handleError(new Error("Sorry, we're having trouble logging out."));
    }
  }

  const content =
    status === STATUS.loading ? (
      <Loader />
    ) : status === STATUS.idle && !active ? (
      <Button text="connect" handleClick={handleConnectButtonClick} />
    ) : (
      <>
        <h3>{shortenAddress(account)}</h3>
        <h3>{ethBalance}</h3>
        <Button text="log out" handleClick={handleLogoutButtonClick} />
      </>
    );

  return <section>{content}</section>;
}
