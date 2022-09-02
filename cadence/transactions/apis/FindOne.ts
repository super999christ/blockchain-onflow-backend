const findOneTx = `
    import ExampleNFT from 0xExampleNFT
    import MetadataViews, NonFungibleToken from 0xTokens

    pub fun main(id: UInt64, address: Address): &NonFungibleToken.NFT {
        let account = getAccount(address)
        let receiverRef = account.getCapability<&{NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
            .borrow() ?? panic("Could not borrow receiver reference")
        return receiverRef.borrowNFT(id: id)
    }
`;

export default findOneTx;
