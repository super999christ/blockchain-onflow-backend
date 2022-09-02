const burnTx = `
    import ExampleNFT from 0xExampleNFT
    import MetadataViews, NonFungibleToken from 0xTokens

    transaction(id: UInt64) {

        // The reference to the collection that will be burning the NFT
        let acctRef: &{NonFungibleToken.CollectionPublic} 
        
        prepare(acct: AuthAccount) {
            self.acctRef = acct.getCapability<&{NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
                .borrow() ?? panic("Could not borrow receiver reference")
        }

        execute {
            self.acctRef.burn(id: id)
        }
    }
`;

export default burnTx;
