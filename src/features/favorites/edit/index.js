import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";

import { STATUS } from "../../../common/constants";
import { Form, ErrorFallback, Loader } from "../../../common/core";
import { logError } from "../../../common/utils";

import { read, update } from "../favorites.service.js";

export default function FavoriteEdit() {
  const [favorite, setFavorite] = useState({});
  const [status, setStatus] = useState(STATUS.idle);
  const history = useHistory();
  const { id } = useParams();
  const handleError = useErrorHandler();

  useEffect(() => {
    const abortController = new AbortController();
    async function loadFavorite() {
      if (status === STATUS.idle) {
        try {
          setStatus(STATUS.loading);
          setFavorite(await read({ id, signal: abortController.signal }));
        } catch ({ message }) {
          handleError(
            new Error(
              `Sorry, the info cannot be loaded into the form: ${message}`
            )
          );
        } finally {
          setStatus(STATUS.idle);
        }
      }
    }
    loadFavorite();
    return () => abortController.abort();
  }, [id]);

  async function handleFormSubmit(form) {
    try {
      await update({
        id,
        ...favorite,
        ...form,
      });
      history.push("/favorites");
    } catch ({ message }) {
      handleError(new Error(`Sorry, the info cannot be updated: ${message}`));
    }
  }

  const { imageUrl, name, nickname, notes } = favorite;

  const config = {
    headerText: `Edit ${name} in your favorites`,
    imageUrl,
    imageAltText: name,
  };

  const data = { nickname, notes };

  const content =
    status === STATUS.loading ? (
      <Loader />
    ) : (
      <ErrorBoundary
        children={
          <Form
            config={config}
            data={data}
            handleFormSubmit={handleFormSubmit}
          />
        }
        FallbackComponent={ErrorFallback}
        onReset={() => setStatus(STATUS.idle)}
        onError={logError}
      />
    );

  return <section>{content}</section>;
}
