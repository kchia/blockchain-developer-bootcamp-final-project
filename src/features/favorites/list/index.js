import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";

import {
  Button,
  Modal as DeleteModal,
  ErrorFallback,
  Loader,
} from "../../../common/core";
import { STATUS } from "../../../common/constants";
import { logError } from "../../../common/utils";

import { list, remove } from "../favorites.service.js";

import styles from "./list.module.css";
export default function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [status, setStatus] = useState(STATUS.idle);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState({});
  const handleError = useErrorHandler();
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    loadFavorites(abortController.signal);
    return () => abortController.abort();
  }, []);

  async function loadFavorites(signal) {
    if (status === STATUS.idle) {
      try {
        setStatus(STATUS.loading);
        setFavorites(await list(signal));
      } catch ({ message }) {
        handleError(
          new Error(
            `Sorry, we're having trouble loading your favorites: ${message}`
          )
        );
      } finally {
        setStatus(STATUS.idle);
      }
    }
  }

  function handleEditButtonClick(id) {
    history.push(`/favorites/${id}/edit`);
  }

  function handleDeleteButtonClick(id, name) {
    setSelected({ id, name });
    setShowModal(true);
  }

  async function reset() {
    await loadFavorites();
    setSelected({});
    setShowModal(false);
  }

  async function handleConfirmDeleteButtonClick() {
    try {
      await remove({ id: selected.id });
    } catch ({ message }) {
      handleError(
        new Error(`Sorry, the favorited asset cannot be deleted: ${message}`)
      );
    } finally {
      reset();
    }
  }

  const favoritesRows = favorites.map(
    ({
      originalAssetId,
      assetContractAddress,
      id,
      imageUrl,
      name,
      nickname,
      notes,
      type,
    }) => {
      const urlPath = `/coins/${originalAssetId}`;

      return (
        <tr className={styles.tableRow} key={id}>
          <td className={styles.tableCell}>{id}</td>
          <td className={styles.tableCell}>
            <Link to={urlPath}>
              <img className={styles.image} src={imageUrl} alt={name} />
            </Link>
          </td>
          <td className={styles.tableCell}>
            <Link to={urlPath}>{name}</Link>
          </td>
          <td className={styles.tableCell}>{type}</td>
          <td className={styles.tableCell}>{nickname}</td>
          <td className={styles.tableCell}>{notes}</td>
          <td className={styles.tableCellButtonContainer}>
            <Button text="edit" handleClick={() => handleEditButtonClick(id)} />
            <Button
              text="delete"
              handleClick={() => handleDeleteButtonClick(id, name)}
            />
          </td>
        </tr>
      );
    }
  );

  const favoritesTable = (
    <table>
      <thead className={styles.tableHeader}>
        <tr>
          {["id", "image", "name", "type", "nickname", "notes", "actions"].map(
            (header) => (
              <th className={styles.tableHeaderCell} key={header}>
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody align="center">{favoritesRows}</tbody>
    </table>
  );

  const content =
    status === STATUS.loading ? (
      <Loader />
    ) : (
      <ErrorBoundary
        children={favoritesTable}
        FallbackComponent={ErrorFallback}
        onReset={() => {
          setFavorites([]);
          setStatus(STATUS.idle);
        }}
        onError={logError}
      />
    );

  return (
    <section className={styles.container}>
      <h2>Favorites</h2>
      {content}
      <DeleteModal
        heading={`Are you sure you want to unfavorite ${selected.name}?`}
        body="This action cannot be undone!"
        handleClose={reset}
        handleSecondaryButtonClick={reset}
        handlePrimaryButtonClick={handleConfirmDeleteButtonClick}
        secondaryText="Cancel"
        primaryText="Delete"
        show={showModal}
      />
    </section>
  );
}
