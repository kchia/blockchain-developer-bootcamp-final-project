import { client } from "../../api/client";
import { formatNumber } from "../../common/utils";

const { NODE_ENV, REACT_APP_API_BASE_URL } = process.env;

const API_URL = `${
  NODE_ENV === "development" ? REACT_APP_API_BASE_URL : ""
}/api/coins`;

async function list(signal) {
  try {
    const coins = await client.get(API_URL, { signal });

    return coins.map(
      ({
        id: originalAssetId,
        icon: imageUrl,
        name,
        price,
        priceChange1d,
        marketCap,
        rank,
      }) => ({
        originalAssetId,
        imageUrl,
        name,
        price: formatNumber(price),
        priceChange1d,
        marketCap: formatNumber(marketCap),
        rank,
      })
    );
  } catch (error) {
    return Promise.reject(error);
  }
}

async function read({ id, signal }) {
  try {
    const {
      availableSupply,
      icon: imageUrl,
      id: originalAssetId,
      marketCap,
      name,
      price,
      priceChange1d,
      rank,
      symbol,
      totalSupply,
      twitterUrl,
      websiteUrl,
    } = await client.get(`${API_URL}/${id}`, { signal });

    return {
      availableSupply: formatNumber(availableSupply),
      originalAssetId,
      imageUrl,
      marketCap: formatNumber(marketCap),
      name,
      price: formatNumber(price),
      priceChange1d,
      rank,
      symbol,
      type: "coin",
      totalSupply: formatNumber(totalSupply),
      twitterUrl,
      websiteUrl,
    };
  } catch (error) {
    return Promise.reject(error);
  }
}

export { list, read };
