const mintTx = `
    import ExampleNFT from 0xExampleNFT
    import MetadataViews, NonFungibleToken from 0xTokens

    // This transaction allows the Minter account to mint an NFT
    // and deposit it into its collection.

    transaction(name: String, description: String, thumbnail: String) {

        // The reference to the collection that will be receiving the NFT
        let receiverRef: &{NonFungibleToken.CollectionPublic}

        // The reference to the minter
        let minterRef: &ExampleNFT.NFTMinter

        prepare(acct: AuthAccount) {
            self.receiverRef = acct.getCapability<&{NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
                .borrow() ?? panic("Could not borrow receiver reference")

            self.minterRef = acct.borrow<&ExampleNFT.NFTMinter>(from: ExampleNFT.MinterStoragePath)
                ?? panic("Could not borrow owner's NFT minter reference")
        }

        execute {
            // Create a new NFT
            self.minterRef.mintNFT(
                recipient: self.receiverRef,
                name: name,
                description: description,
                thumbnail: thumbnail,
                royalties: []
            )
        }
    }
`;

export default mintTx;
