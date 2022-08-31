const mintTx = `
    import ExampleNFT from 0xExampleNFT
    import MetadataViews, NonFungibleToken from 0xTokens

    // This transaction allows the Minter account to mint an NFT
    // and deposit it into its collection.

    transaction(name: String, description: String, thumbnail: String) {

        // The reference to the collection that will be receiving the NFT
        let receiverRef: &ExampleNFT.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}

        prepare(acct: AuthAccount) {
            self.receiverRef = acct.getCapability<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(ExampleNFT.CollectionPublicPath)
                .borrow() ?? panic("Could not borrow receiver reference")
        }

        execute {
            // Create a new NFT
            let newNFT <- ExampleNFT.mintNFT(
                name: name,
                description: description,
                thumbnail: thumbnail,
                royalties: []
            )

            self.receiverRef.deposit(token: <- newNFT)
        }
    }
`;

export default mintTx;
