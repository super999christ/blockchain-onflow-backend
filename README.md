# Onflow Backend

## Description

Interacting between the [Flow](https://www.onflow.org/) blockchain and [Nest](https://github.com/nestjs/nest) framework.
  - Interacting with a smart contract using [Cadence](https://docs.onflow.org/cadence/language/), Flow's smart contract programming language
  - Designing a backend API that communicates with the smart contract functionalities using [GraphQL](https://graphql.org/)
  - Testing our application code so that it is free of bugs and logic errors

## Installation

```bash
$ npm install
```

## Environment
1. In a separate terminal, run the following command:
    ```sh
    flow emulator
    ```
    This will spin up a server that emulates the behavior of the actual Flow blockchain allowing you to develop more efficiently without putting stress on the actual network. Please make sure that this terminal is open as you develop! The emulator also logs all the transactions and scripts you send to it using the FCL library, so feel free to examine its logs for debugging purposes! 

2. In another separate terminal, run the following command:
    ```sh
    bash ./setup-emulator
    ```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests and integration tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

### **API development**

  - **1**: `Mint`
    - This resolver should create an `ExampleNFT` on the blockchain and send it to our local development account (0x01cf0e2f2f715450).
      - Sample input:
        ```ts
        {
          "name": "A sample name.",
          "description": "A sample description."
          "thumbail": "A sample thumbnail."
        }
        ```
      - Sample output:
        ```ts
        {
          "transactionId": "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690"
        }
        ```

  - **2**: `Find Many`
    - This resolver should take an address as input and return all the NFTs owned by the address. If no address is specified, return all `ExampleNFT`s in our local account (0x01cf0e2f2f715450). Add pagination(defualt: 5 results per page).
      - Sample input:
        ```
        {
          "address": "0x01cf0e2f2f715450"
          
          // In your submission, feel free to add more fields for pagination. Example:
          // "limit": 5,
          // "offset": 0
        }
        ```
      - Sample output:
        ```ts
        {
          "data": [
            {
              "name": "<some string>",
              "description": "<some string>",
              "file": {
                "url": "<A fake URL>"
              }
            },
            ...
          ]
        }
        ```

  - **3**: `Find One`
    - This resolver should take an address and NFT ID as input. It should check if the account has the NFT corresponding to the given ID and if it does it should return its metadata. If the NFT does not exist, it should return a 404 (Not Found) response. If no address is specified, use our local account (0x01cf0e2f2f715450). If no NFT ID is specified it should return a 400 (Bad Request) response.
      - Sample input:
        ```
        {
          "id": 0,
          "address": "0x01cf0e2f2f715450"
        }
        ```
      - Sample output:
        ```ts
        {
          "data": {
            "name": "<some string>",
            "description": "<some string>",
            "file": {
              "url": "<A fake URL>"
            }
          }
        }
        ```

  - **4**: `Burn`
    - This resolver should take an NFT ID as input and delete the `ExampleNFT` with the corresponding ID from our development account (0x01cf0e2f2f715450).
      - Sample input:
        ```ts
        {
          // The ID of the NFT to transfer
          "id": 0
        }
        ```
      - Sample output:
        ```ts
        {
          "transactionId": "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690"
        }
        ```

  - **5**: `Transfer`
    - This resolver should transfer a specific `ExampleNFT` from our development account (0x01cf0e2f2f715450) to the specified address.
      - Sample input:
        ```ts
        {
          // The ID of the NFT to transfer
          "id": 0,

          // The address of the account that will receive the NFT
          "receiver": "0x01cf0e2f2f715450"
        }
        ```
      - Sample output:
        ```ts
        {
          "transactionId": "e0b97916b821adc178390f075bb44bb6e42d0617ec2c51bf966f40506e79d690"
        }
        ```