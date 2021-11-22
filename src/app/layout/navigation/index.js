import { Link } from "react-router-dom";

import styles from "./navigation.module.css";
export default function Navigation({
  navLinksData = [
    { name: "home", path: "/" },
    { name: "coins", path: "/coins" },
    { name: "favorites", path: "/favorites" },
  ],
}) {
  const navListItems = navLinksData.map(({ name, path }) => (
    <li className={styles.navLinkContainer} key={name}>
      <Link className={styles.navLink} to={path}>
        {name}
      </Link>
    </li>
  ));

  return (
    <nav>
      <ul className={styles.navBar}>{navListItems}</ul>
    </nav>
  );
}
