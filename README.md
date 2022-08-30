# Onflow Backend Interview Challenge

## **Getting Started**

### **Background**

Welcome to the Anchain.ai backend SWE interview assignment! Thank you for your interest in Anchain and congrats on being one of the few applicants that stood out for the role! In order to see if you'd be a good fit for the position, we're going to give you a chance to demonstrate what you're capable of! The following assignment will be broken up into 3 tasks and you will have around 72 hours to make it as far as you can! You are allowed (and strongly encouraged) to look up any documentation for all tasks. You'll be interacting very closely with the [Flow Client Library](https://github.com/onflow/fcl-js) to send [transactions](https://docs.onflow.org/cadence/language/transactions/) and run [scripts](https://docs.onflow.org/flow-js-testing/execute-scripts/#gatsby-focus-wrapper).

In this assignment, we'll be working with the [Flow](https://www.onflow.org/) blockchain. We'll go through the entire process of:
  - Interacting with a smart contract using [Cadence](https://docs.onflow.org/cadence/language/), Flow's smart contract programming language
  - Designing a backend API that communicates with the smart contract functionalities
  - Testing our application code so that it is free of bugs and logic errors
  
If you're new to blockchain development that's perfectly okay! We're not expecting you to finish the whole assignment within the allotted time limit. What's more important is that you can demonstrate potential in adapting to a (potentially) new set of blockchain concepts before we even get to meet you! We'll be looking out for a few key things in your submission:

  - How fast can you pick up (potentially) new technologies / software?
  - Were you able to problem solve or find relevant documentation when you got stuck?
  - Do you know the fundamentals of how to design and secure APIs using modern Node.js frameworks?
  - How's your code quality and organization? Is it easy for other developers who have never touched your codebase to quickly pick up your code?
  - Are you sufficiently covering your edge cases? Are you correctly validating user inputs?

With that being said, let's get started!

## **Setting up Your Development Environment**

1. First, create a new **private** repo and copy over the code in this repo to it. Please do not push your solution directly to this repo.

2. Add the following member(s) as collaborators to your private repo:
    - chris.deleon@anchain.ai

3. Please make sure you have the following software installed on your machine:
    - [Node.js](https://nodejs.org/en/download/) ^16.15.1
    - [Flow CLI](https://docs.onflow.org/flow-cli/install/) ^0.37.3

4. In a separate terminal, run the following command:
    ```sh
    flow emulator
    ```
    This will spin up a server that emulates the behavior of the actual Flow blockchain allowing you to develop more efficiently without putting stress on the actual network. Please make sure that this terminal is open as you develop! The emulator also logs all the transactions and scripts you send to it using the FCL library, so feel free to examine its logs for debugging purposes! 

4. In another separate terminal, run the following command:
    ```sh
    bash ./setup-emulator
    ```
    This will automatically create a blockchain account for development purposes, fund the account with Flow tokens to cover transaction fees, and deploy the contracts needed to complete the challenge to the account. If at any time you'd like to start from a fresh slate, you can restart the emulator and re-run this script.

## **The Assignment**

### **Background**

In the home directory of this repository, you'll find a folder named `cadence`, which consists of several Flow transactions and the `ExampleNFT` smart contract, which we'll be building an API around.

**NOTE:** The addresses of the smart contracts, our local development account, and more can be found in `flow.json`.

### **Task 1: API development**

For this next task, we're going to build an API that interacts with the smart contract that we fixed in task 1! Please use **NestJS**, **Typescript**, and **GraphQL** to implement the following specification. The API we will be building should support the following functionalities:

  - **2.1**: `Mint`
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

  - **2.2**: `Find Many`
    - This resolver should take an address as input and return all the NFTs owned by the address. If no address is specified, return all `ExampleNFT`s in our local account (0x01cf0e2f2f715450). We will be expecting pagnination to be implemented for this resolver. We recommend using either limit-offset pagination or cursor pagination. Please use 5 results per page.
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

  - **2.3**: `Find One`
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

  - **2.4**: `Burn`
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

  - **2.5**: `Transfer`
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

**HINT 1:** The Flow emulator running in your other terminal should have some interesting logs for you to look at! You can also enable verbose mode using: `flow emulator -v`

**HINT 2:** Check [this](https://github.com/onflow/kitty-items) out!

**HINT 3:** Need examples of how to write a Cadence *script*? You may wanna take a look [here](https://docs.onflow.org/fcl/tutorials/flow-app-quickstart/#querying-the-blockchain) and [here](https://docs.onflow.org/fcl/reference/scripts/)!

**HINT 4:** Need examples of how to write a Cadence *transaction*? You may wanna take a look [here](https://docs.onflow.org/fcl/tutorials/flow-app-quickstart/#mutating-the-blockchain) and [here](https://docs.onflow.org/fcl/reference/transactions/)!

**HINT 5:** Take a look at some of the [NestJS documentation](https://docs.nestjs.com/), [GraphQL documentation](https://graphql.org/learn/), and [Flow API documentation](https://docs.onflow.org/fcl/reference/api/)!

### **Task 2: Testing**

For this final task, we're going to write some test cases for the API we developed in task 2! You can use any testing framework you'd like, but we recommend using [Jest](https://jestjs.io/). The main thing we'll be looking for here is how well you can test your code and identify edge cases. For this task, it is also acceptable to write down the cases that you would like to test by using comments in the code or by creating a markdown file with bullet points of each test case. If you go with this approach, we'd expect three things:
  1. Name of the thing you are testing
  2. The thing you'd like to test
  3. Brief description/psuedocode of the test case (what pre-conditions would you set up, what would the actual test involve, etc.)

## **Submission**
  - When finished, please notify us by email and we'll have one of our engineers review the private repo with your submission. If we think you'd be a good fit, we will schedule a call to meet with you, chat about your solution, and let you perform a demo of what you have!
  - Please note that while it is okay to make edits to your code after submission, **we will grade you based on the most recent commit that was submitted before the deadline**. Be sure to have all your changes committed before then!
