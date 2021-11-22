import PropTypes from "prop-types";
import styles from "./error-fallback.module.css";

export default function ErrorFallback({
  error: { message },
  resetErrorBoundary,
}) {
  return (
    <section role="alert">
      <h2>Something went wrong:</h2>
      <pre className={styles.message}>{message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </section>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  resetErrorBoundary: PropTypes.func.isRequired,
};
