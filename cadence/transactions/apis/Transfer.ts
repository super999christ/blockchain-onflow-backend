const burnTx = `
    import ExampleNFT from 0xExampleNFT
    import MetadataViews, NonFungibleToken from 0xTokens

    transaction(id: UInt64, receiver: Address) {

        // The reference to the collection that will be sending the NFT
        let acctRef: &{NonFungibleToken.CollectionPublic}

        // The reference to the collection that will be receiving the NFT
        let receiverRef: &{NonFungibleToken.CollectionPublic}

        prepare(acct: AuthAccount) {
            self.acctRef = acct.borrow<&{NonFungibleToken.CollectionPublic}>(from: ExampleNFT.CollectionStoragePath)
                ?? panic("Could not borrow a reference to the owner's collection")
            
            let receiverAcct = getAccount(receiver)
            self.receiverRef = receiverAcct.getCapability<&{NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
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
