# [Final Project]

[One-sentence description of final project]
NFTs (Non-Fungible Tokens)
each token is unique
each NFT has its own characteristics
ERC-721 is the most popular token standard
list NFT on OpenSea on the rinkeby testnet
Chainlink + NFTs = dynamic NFTs, more powerful version of NFTs
provably random attributes that change over time
NFT that changes prices of an asset

NFT metadata - image and attributes are the metadata, which are expensive to store on-chain
store data off-chain on a server but that's not decentralized.
In comes Filecoin, store metadata in a decentralized manner.

IPFS - Filecoin is built on top of IPFS
IPFS does not guarantee data remain online but Filecoin does
NFT.storage is what will be used.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Deployed Site URL

[Heroku: Consensys Final Project](https://www.pacific-sea-29544.herokuapp.com)

## Screencast URL

[YouTube: Consensys Final Project]()

## Public Ethereum Address

## Problem

[Describe Problem]

## Solution

[Describe Solution]

## How [Solution] Works

[Describe how Solution works]

## How to Use [Solution]/Workflow

1. asdf
2. asdf
3. asdf
4. asdf

## User Stories

1. As a user, I want to login/connect with my MetaMask wallet, so that I can access the app.
2. As a user, I want to ..., so that I can ...
3. As a user, I want to ..., so that I can ..,

## Tech Stack

### Chainlink VRF

Make a dynamic NFT with provably random trait using the Chainlink VRF
Connected to the Chainlink data feed
### Filecoin

The NFT is stored on Filecoin
## Installation
### Prerequisites

- MetaMask Wallet 
- Git
- Node.js v.14+
- Truffle
- Ganache
- Yarn

### Running the project locally

First, fork and then clone the project locally.

In the project root, you can run `yarn install` to install the frontend and smart contract dependencies.

Then run `yarn start`, which concurrently runs the app in the development mode, starts a REST API at `http://localhost:3004`, and populates the local blockchain with test data.\

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Merging code into `main` automatically kicks off the deployment to Heroku.

### Running a local Ganache blockchain

- In your terminal, run `ganache-cli -p 7545` to start an Ethereum blockchain at port `7545`.
- Run `truffle compile` to create the build artifacts directory, which contain the bytecodes version of the smart contracts, ABIs, etc.
- Run `truffle test` to execute the unit tests for the smart contracts.
- Run `truffle migrate --network rinkeby` to deploy the smart contracts to the Rinkeby network.
### Directory Structure

- `/.github/workflows`: contains the configuration files for building and deploying the app automatically
- `/eth-contracts`
  - `/contracts`: contains smart contract code written in Solidity
    - `Migrations.sol`: A contract that keeps track of changes made to the code onchain to avoid duplicative deployment 
  - `/migrations`: contains the Truffle migration files that describe how to deploy the project's smart contracts
  - `/test`: contains the smart contract test code
  - `/truffle-config.js`: configuration and settings file for smart contract development and deployment
  - `/scripts`: contains scripts for calling the smart contract
- `/src`
  - `/api`
    - `client.js`: a client wrapper around the Fetch API that supports `GET`, `POST`, `PUT`, and `DELETE` requests
  - `/app`: contains the top-level component for the application
    - `/layout`
      - `/footer`: contains the `Footer` component and css file
      - `/header`: contains the `Header` component and css file
      - `/navigation`: contains the `Navigation` component and css file
      - `index.js`: defines and exports the `Layout` component, which contains the routing for the application
      - `layout.module.css`
    - `index.js`: exports the `App` component, which can render different layouts
    - `store.js`: configures and exports the Redux store
  - `/common`: contains code used across components annd throughout the application
    - `/constants`: contains shared constants (e.g., `STATUS.idle`)
    - `/core`: contains generic components (e.g., `Button`, `Modal`, `Loader`, etc.)
    - `/utils`: contains utility functions (e.g., `formatNumber()`)
  - `/features`: contains the code for the main features of the application
    - `/no-match`
      - `index.js`
    - `index.js`: exports the components from the `/features` folder
  - `/styles`
    - `global.css`: contains global css styles used throughout the application
  - `index.js`: entry point to the React Application
  - `setupTests.js`: import any additional libraries used to extend test functionality (e.g, `jest-dom`)
- `.gitignore`: specifies the files to ignore when committing the project to Github
- `avoiding_common_attacks.md`: describes common attack vectors and their SWC numbers that the smart contract protects against
- `db.json`: JSON database for your fake REST API
- `deployed_address.txt`: contains information on the testnet address and the network the smart contract was deployed to
- `design_pattern_decisions.md`: describes the design pattern decisions used to build the smart contract
- `package.json`: manifest file for the project
- `Procfile`: a file containing commands to be run by the app's dynos after it is deployed to Heroku  
- `routes.json`: routing logic for your fake REST API
- `server.js`: the server setup script that the app's dynos will run after the app is deployed to Heroku

The following principles were applied in the design of the folder structure:

- A consistent and predictable naming convention makes it relatively easy to locate needed files and understand where new files should be created. Each feature contains sub-folders that represent a CRUD operation for that feature (e.g., `/create`, `/edit`).

- All files related to a component (e.g., component, test, and css files) are kept together under a single folder so it's easy to find and update the code for a given feature.

- The service abstracts away the API logic for each feature, thereby avoiding the need to hard-code the API calls into the components directly.

- Core UI components such as Button, Form, List, etc. are kept in a separate directory (i.e., `src/common/core`). As the UI library continues to grow, the core UI library could be packaged for use in another project or published as part of Storybook. Some developers on the team can even focus on this directory only.

## Other Available Scripts

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
