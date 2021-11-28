import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { Loader, Modal as SuccessModal } from "../../common/core";
import { STATUS } from "../../common/constants";
import { Auth, MintEllipticalArtForm, EllipticalView } from "../../features";
import {
  selectElliptical,
  selectMintRandomEllipticalStatus,
} from "../../features/ellipticals/ellipticals.slice";

import styles from "./home.module.css";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const { active } = useWeb3React();
  const history = useHistory();
  const status = useSelector(selectMintRandomEllipticalStatus);
  const elliptical = useSelector(selectElliptical);

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
        <EllipticalView drawRecursively />
      </div>
      <SuccessModal
        handlePrimaryButtonClick={handleSuccessModalDoneButtonClick}
        handleSecondaryButtonClick={handleSuccessModalClose}
        heading="Here's your unique, one-of-a-kind elliptical..."
        show={showModal}
        body={
          status === STATUS.loading ? (
            <Loader />
          ) : (
            <EllipticalView elliptical={elliptical} />
          )
        }
        primaryText="done"
        secondaryText="close"
        handleClose={handleSuccessModalClose}
      />
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
