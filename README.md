# DLC.Link - dlcBTC Bridge

## Installation

To install all the dependencies, run the following command:

```bash
yarn install
```

or

```bash
npm install
```

## Setup Environment Variables

This application uses environment variables for configuration. These are stored in `.env` files. There are different `.env` files for different environments:

- `.env.localhost`: For locally run attestors / regtest bitcoin.
- `.env.devnet`: For deployed devnet attestors / regtest bitcoin.
- `.env.testnet`: For deployed testnet attestors / testnet bitcoin.
- `.env.mainnet`: For deployed mainnet attestors / mainnet bitcoin.

Copy the contents of the `.env` template file into the appropriate `.env` file for your environment and fill in the values. The template for the environment variables can be found in the `.env.template` file in the root directory of this project.

Please ensure that you replace the placeholders with your actual values.

## Running the Application

According to the environment you want to run the application in, you can run the following commands:

- For locally ran attestors / regtest bitcoin:

```bash
  yarn localhost
```

- For deployed devnet attestors / regtest bitcoin:

```bash
   yarn devnet
```

- For deployed testnet attestors / testnet bitcoin:

```bash
  yarn testnet
```

- For deployed mainnet attestors / mainnet bitcoin:

```bash
   yarn mainnet
```
