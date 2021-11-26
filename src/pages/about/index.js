import { Link } from "react-router-dom";
import styles from "./about.module.css";
export default function AboutPage() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>About</h2>

      <h3>About bubblesNFT</h3>

      <p>There can only ever be 1,000 unique bubbles minted.</p>

      <p>
        Read more about <Link to="/how-it-works">how it works.</Link>
      </p>
    </section>
  );
}
