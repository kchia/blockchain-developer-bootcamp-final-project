import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { Modal as SuccessModal } from "../../common/core";
import { STATUS } from "../../common/constants";
import { Auth, MintEllipticalArtForm, EllipticalView } from "../../features";
import {
  selectError,
  selectMintRandomEllipticalStatus,
  selectTransactionHash,
} from "../../features/ellipticals/ellipticals.slice";

import styles from "./home.module.css";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const status = useSelector(selectMintRandomEllipticalStatus);
  const error = useSelector(selectError);
  const transactionHash = useSelector(selectTransactionHash);
  const { active } = useWeb3React();
  const history = useHistory();

  function handleSuccessModalClose() {
    setShowModal(false);
  }

  function handleSuccessModalDoneButtonClick() {
    history.push("/ellipticals");
  }

  const content = active ? (
    <>
      <div className={styles.secondaryContainer}>
        <MintEllipticalArtForm setShowModal={setShowModal} />
        {status === STATUS.loading ? null : <EllipticalView drawRecursively />}
      </div>
      <SuccessModal
        handlePrimaryButtonClick={handleSuccessModalDoneButtonClick}
        handleSecondaryButtonClick={handleSuccessModalClose}
        heading={
          error
            ? "Sorry, there's a problem..."
            : "Here's your transaction hash..."
        }
        show={showModal}
        primaryText="done"
        secondaryText="close"
        handleClose={handleSuccessModalClose}
      >
        {error ? (
          <p>{error}</p>
        ) : (
          <>
            <p>
              Check on the progress of the transaction on Ethernet:
              <a href={`https://rinkeby.etherscan.io/tx/${transactionHash}`}>
                {transactionHash}
              </a>
            </p>
            <p>
              After the transaction is successful, it may take a few minutes for
              your NFT to appear at the{" "}
              <Link to="/ellipticals">ellipticals page</Link>, so please be
              patient.
            </p>
          </>
        )}
      </SuccessModal>
    </>
  ) : (
    <>
      <EllipticalView drawRecursively />
      <Auth />
    </>
  );

  return (
    <section className={styles.container}>
      <h2>Create unique, one-of-a-kind elliptical art</h2>
      {content}
    </section>
  );
}
