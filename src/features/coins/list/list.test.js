// Import REST API mocking utilities from the Mock Service Worker library
// Use msw to mock API calls that the tested component makes
import { rest } from "msw";
import { setupServer } from "msw/node";

// Import testing methods from the React Testing Library
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { MemoryRouter as Router, Route, Switch } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { Provider } from "react-redux";

import { store } from "../../../app/store";
import CoinsList from "./index";
import testData from "./list.data.js";

const server = setupServer(
  // Intercept "GET http://localhost:3004/api/coins" requests
  rest.get("http://localhost:3004/api/coins", (request, response, ctx) => {
    // Respond using a mocked JSON body
    return response(ctx.json(testData));
  })
);

function renderWithRoutes() {
  render(
    <Provider store={store}>
      <Router initialEntries={["/coins"]}>
        <Switch>
          <Route exact path="/coins">
            <ErrorBoundary
              fallback={
                <section role="alert">
                  <h2>Something went wrong:</h2>
                </section>
              }
            >
              <CoinsList />
            </ErrorBoundary>
          </Route>
          <Route path="/coins/:id">
            <ErrorBoundary
              fallback={
                <section role="alert">
                  <h2>Something went wrong:</h2>
                </section>
              }
            >
              <h2>Bitcoin view page</h2>
            </ErrorBoundary>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

describe("CoinsList", () => {
  // Set up API mocking before all tests
  beforeAll(() => server.listen());

  // Reset any request handlers after each test
  afterEach(() => server.resetHandlers());

  // Shut down the server once the tests are done
  afterAll(() => server.close());

  // For each test, follow the arrange-act-assert pattern
  test("displays the correct heading", async () => {
    // Arrange
    renderWithRoutes();

    // Act
    await waitFor(() => screen.getByRole("heading", { level: 2 })); // `waitFor` waits until the callback doesn't throw an error (i.e., until the h2 tag is rendered on the page).

    // Assert
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Top 20 Coins by Market Cap"); // Assert that the heading is correct using `toHaveTextContent()`
  });

  test("displays the correct table columns", async () => {
    // Arrange
    renderWithRoutes();

    // Act
    await waitFor(() => screen.getAllByRole("columnheader"));

    // Assert
    const columnHeaders = screen.getAllByRole("columnheader");
    const expected = ["#", "ICON", "NAME", "PRICE", "MCAP", "24H"];

    columnHeaders.forEach((columnHeader, index) => {
      expect(columnHeader).toHaveTextContent(expected[index]);
    });
  });

  test("displays 20 results", async () => {
    // Arrange
    renderWithRoutes();

    // Act
    await waitFor(() => screen.getByText("Bitcoin"));

    // Assert
    const coinsRows = screen.getAllByRole("row");
    expect(coinsRows).toHaveLength(21); // including the column header row
  });

  test("routes to coin view page on clicking a coin icon", async () => {
    // Arrange
    renderWithRoutes();

    // Act
    await waitFor(() => screen.getByText("Bitcoin"));
    await fireEvent.click(screen.getByAltText("Bitcoin")); // simulate a click on the icon

    // Assert
    expect(screen.getByText(/Bitcoin view page/i)).toBeInTheDocument();
  });

  test("routes to coin view page on clicking a coin name", async () => {
    // Arrange
    renderWithRoutes();

    // Act
    await waitFor(() => screen.getByText("Bitcoin"));
    await fireEvent.click(screen.getAllByRole("link")[0]); // simulate a click on the name

    // Assert
    expect(screen.getByText("Bitcoin view page")).toBeInTheDocument();
  });

  test("handles rendering error", async () => {
    // Arrange
    const spy = jest.spyOn(console, "error").mockImplementation(() => {}); // mute the console errors
    render(
      <Provider store={store}>
        <CoinsList />
      </Provider>
    ); // rendering CoinsList without wrapping it in a Router component will throw a rendering error

    // Act
    await waitFor(() => screen.getByRole("alert"));

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent(
      /Something went wrong/i
    );

    spy.mockRestore(); // restore console.error() to its original implementation
  });

  test("handles server error", async () => {
    // Arrange
    const spy = jest.spyOn(console, "error").mockImplementation(() => {}); // mute the console errors
    server.use(
      rest.get("http://localhost:3004/api/coins", (request, response, ctx) => {
        return response(ctx.status(500));
      })
    );
    renderWithRoutes();

    // Act
    await waitFor(() => screen.getByRole("alert"));

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent(
      /Something went wrong/i
    );

    spy.mockRestore(); // restore console.error() to its original implementation
  });
});
