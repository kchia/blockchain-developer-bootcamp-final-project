import { useEffect } from "react";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";

import { ErrorFallback, Loader } from "../../../common/core";
import { STATUS } from "../../../common/constants";
import { logError } from "../../../common/utils";

import {
  coinsReset,
  fetchCoins,
  selectAllCoins,
  selectFetchCoinsStatus,
} from "../coins.slice";

import {
  container,
  tableHeader,
  tableHeaderCell,
  tableRow,
  tableCell,
  image,
  negative,
  positive,
} from "./list.module.css";

export default function CoinsList() {
  const coins = useSelector(selectAllCoins);
  const status = useSelector(selectFetchCoinsStatus);
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  const { active } = useWeb3React();

  useEffect(() => {
    const abortController = new AbortController();
    async function loadCoins() {
      try {
        await dispatch(fetchCoins(abortController.signal)).unwrap();
      } catch ({ message }) {
        handleError(
          new Error(`Sorry, we're having trouble loading the coins: ${message}`)
        );
      }
    }
    loadCoins();

    return () => abortController.abort();
  }, [dispatch, handleError]);

  const coinsRows = coins.map(
    (
      {
        originalAssetId,
        imageUrl,
        name,
        price,
        marketCap,
        priceChange1d,
        rank,
      },
      index
    ) => {
      const priceChangeElementClassName =
        priceChange1d < 0 ? negative : positive;

      return (
        <tr className={tableRow} key={`${originalAssetId}-${index}`}>
          <td className={tableCell}>{rank}</td>
          <td className={tableCell}>
            <Link to={`/coins/${originalAssetId}`}>
              <img className={image} src={imageUrl} alt={name} />
            </Link>
          </td>
          <td>
            <Link to={`/coins/${originalAssetId}`}>
              <span>{name}</span>
            </Link>
          </td>
          <td>${price}</td>
          <td>${marketCap}</td>
          <td className={priceChangeElementClassName}>{priceChange1d}%</td>
        </tr>
      );
    }
  );

  const coinsTable = (
    <table>
      <thead className={tableHeader}>
        <tr>
          <th className={tableHeaderCell}>#</th>
          <th className={tableHeaderCell}>ICON</th>
          <th className={tableHeaderCell}>NAME</th>
          <th className={tableHeaderCell}>PRICE</th>
          <th className={tableHeaderCell}>MCAP</th>
          <th className={tableHeaderCell}>24H</th>
        </tr>
      </thead>
      <tbody align="center">{coinsRows}</tbody>
    </table>
  );

  const content =
    status === STATUS.loading ? (
      <Loader />
    ) : (
      <ErrorBoundary
        children={coinsTable}
        FallbackComponent={ErrorFallback}
        onReset={() => dispatch(coinsReset())}
        onError={logError}
      />
    );

  const notActive = !active && <h3>Connect wallet to continue</h3>;

  return (
    <section className={container}>
      {notActive}
      <h2>Top 20 Coins by Market Cap</h2>
      {content}
    </section>
  );
}
