import { Redirect, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  CoinsList,
  CoinView,
  FavoritesList,
  FavoriteCreate,
  FavoriteEdit,
  NoMatch,
} from "../../features";

import Header from "./header";
import Footer from "./footer";
import RouteWithErrorBoundary from "./route-with-error-boundary";

import {
  favoriteSelected,
  selectFavorite,
} from "../../features/favorites/favorite.slice";

export default function Layout() {
  const favorite = useSelector(selectFavorite);
  const dispatch = useDispatch();

  function handleFavoriteChange(favorite) {
    dispatch(favoriteSelected(favorite));
  }

  return (
    <>
      <Header />
      <main>
        <Switch>
          <Route exact path="/">
            <Redirect to="/coins" />
          </Route>

          <RouteWithErrorBoundary exact path="/coins">
            <CoinsList />
          </RouteWithErrorBoundary>
          <RouteWithErrorBoundary path="/coins/:id">
            <CoinView handleFavoriteChange={handleFavoriteChange} />
          </RouteWithErrorBoundary>

          <RouteWithErrorBoundary exact path="/favorites">
            <FavoritesList />
          </RouteWithErrorBoundary>
          <RouteWithErrorBoundary path="/favorites/new">
            <FavoriteCreate favorite={favorite} />
          </RouteWithErrorBoundary>
          <RouteWithErrorBoundary path="/favorites/:id/edit">
            <FavoriteEdit />
          </RouteWithErrorBoundary>

          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </main>
      <Footer />
    </>
  );
}
