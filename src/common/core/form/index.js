import PropTypes from "prop-types";
import { useState, useEffect } from "react";

export default function Form({
  config: { headerText, imageUrl, imageAltText },
  data: { notes = "", nickname = "" } = {},
  handleFormSubmit,
}) {
  const [formData, setFormData] = useState({ notes: "", nickname: "" });

  useEffect(() => {
    setFormData({
      notes,
      nickname,
    });
  }, [notes, nickname]);

  function handleChange({ target: { name, value } }) {
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleFormSubmit(formData);
    setFormData({ notes: "", nickname: "" });
  }

  return (
    <>
      <h2>{headerText}</h2>
      <img src={imageUrl} alt={imageAltText} />
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label htmlFor="nickname">
              Nickname for the asset:
              <input
                id="nickname"
                type="text"
                name="nickname"
                onChange={handleChange}
                value={formData.nickname}
                required
              />
            </label>
          </li>
          <li>
            <label htmlFor="notes">
              Notes:
              <textarea
                id="notes"
                name="notes"
                onChange={handleChange}
                value={formData.notes}
                required
              />
            </label>
          </li>
        </ul>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

Form.propTypes = {
  handleFormSubmit: PropTypes.func,
  config: PropTypes.exact({
    headerText: PropTypes.string,
    imageUrl: PropTypes.string,
    imageAltText: PropTypes.string,
  }),
  data: PropTypes.exact({
    nickname: PropTypes.string,
    notes: PropTypes.string,
  }),
};
