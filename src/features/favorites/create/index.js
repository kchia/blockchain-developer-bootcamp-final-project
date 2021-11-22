import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useErrorHandler } from "react-error-boundary";
import { useSelector, useDispatch } from "react-redux";

import { Form, Loader } from "../../../common/core";
import { STATUS } from "../../../common/constants";

import { createNewFavorite, selectCreateStatus } from "../favorite.slice";

export default function FavoriteCreate({
  favorite: { name, imageUrl, ...favorite },
}) {
  const createStatus = useSelector(selectCreateStatus);
  const history = useHistory();
  const handleError = useErrorHandler();
  const dispatch = useDispatch();

  async function handleFormSubmit(form) {
    try {
      await dispatch(
        createNewFavorite({
          name,
          imageUrl,
          ...favorite,
          ...form,
        })
      ).unwrap();
      history.push("/favorites");
    } catch ({ message }) {
      handleError(new Error(`Sorry, we're having trouble saving: ${message}`));
    }
  }

  const config = {
    headerText: `Add ${name} to your favorites`,
    imageAltText: name,
    imageUrl,
  };

  const renderLoader = createStatus === STATUS.loading && <Loader />;

  return (
    <section>
      {renderLoader}
      <Form config={config} handleFormSubmit={handleFormSubmit} />
    </section>
  );
}

FavoriteCreate.propTypes = {
  favorite: PropTypes.exact({
    originalAssetId: PropTypes.string,
    name: PropTypes.string,
    imageUrl: PropTypes.string,
    type: PropTypes.string,
    assetContractAddress: function (props, propName, componentName) {
      if (props.type === "NFT" && !props[propName])
        return new Error(
          `Invalid prop ${propName}:${props[propName]} supplied to ${componentName}. Validation failed.`
        );
    },
  }),
};
