import styles from "./button.module.css";
import PropTypes from "prop-types";
export default function Button({ text, handleClick }) {
  return (
    <button className={styles.button} onClick={handleClick}>
      {text}
    </button>
  );
}

Button.propTypes = {
  handleClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};
