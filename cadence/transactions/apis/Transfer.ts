const burnTx = `
    import ExampleNFT from 0xExampleNFT
    import MetadataViews, NonFungibleToken from 0xTokens

    transaction(id: UInt64, receiver: Address) {

        // The reference to the collection that will be sending the NFT
        let acctRef: &ExampleNFT.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection} 

        // The reference to the collection that will be receiving the NFT
        let receiverRef: &ExampleNFT.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection} 

        prepare(acct: AuthAccount) {
            self.acctRef = acct.borrow<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(from: ExampleNFT.CollectionStoragePath)
                ?? panic("Could not borrow a reference to the owner's collection")
            
            let receiverAcct = getAccount(receiver)
            self.receiverRef = receiverAcct.getCapability<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(ExampleNFT.CollectionPublicPath)
                .borrow() ?? panic("Could not borrow receiver reference")
            if (self.acctRef == self.receiverRef) {
                panic("Can not transfer to the same account.")
            }
        }
        
        execute {
            self.acctRef.transfer(id: id, recipient: self.receiverRef)
        }
    }
`;

export default burnTx;
