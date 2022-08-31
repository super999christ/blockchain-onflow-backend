const findManyTx = `
    import ExampleNFT from 0xExampleNFT
    import MetadataViews, NonFungibleToken from 0xTokens


    pub fun main(address: Address): [&NonFungibleToken.NFT] {
        let account = getAccount(address)
        let receiverRef = account.getCapability<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(ExampleNFT.CollectionPublicPath)
            .borrow() ?? panic("Could not borrow receiver reference")

        let keys = receiverRef.getIDs()
        let nfts: [&NonFungibleToken.NFT] = []
        
        for key in keys {
            nfts.append(receiverRef.borrowNFT(id: key))
        }
        
        return nfts
    }
`;

export default findManyTx;
