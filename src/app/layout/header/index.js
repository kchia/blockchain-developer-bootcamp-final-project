import { Link } from "react-router-dom";
import { ConnectButton } from "../../../features";
import styles from "./header.module.css";
import Navigation from "../navigation";

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div>
        <Link className={styles.headerLink} to="/">
          <h1>Consensys Final Project</h1>
        </Link>
        <Navigation />
      </div>
      <ConnectButton />
    </header>
  );
}
