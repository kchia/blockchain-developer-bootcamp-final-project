import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./modal.module.css";

export default function CustomModal({
  handleClose,
  handleSecondaryButtonClick,
  handlePrimaryButtonClick,
  heading,
  body,
  secondaryText,
  onHide,
  primaryText,
  show,
}) {
  return (
    <Modal className={styles.modalContainer} show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className={styles.modalTitle}>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSecondaryButtonClick}>
          {secondaryText}
        </Button>
        <Button variant="primary" onClick={handlePrimaryButtonClick}>
          {primaryText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
