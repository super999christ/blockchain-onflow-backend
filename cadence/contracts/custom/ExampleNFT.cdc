/**
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
**/
import NonFungibleToken from "../standard/NonFungibleToken.cdc"
import MetadataViews from "../standard/MetadataViews.cdc"

pub contract ExampleNFT: NonFungibleToken {
  pub var totalSupply: UInt64

  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)
  pub event Minted(id: UInt64, name: String, description: String, thumbnail: String)
  pub event Burned(id: UInt64, address: Address?)

  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath
  pub let MinterStoragePath: StoragePath

  pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
    pub let id: UInt64
    pub let name: String
    pub let description: String
    pub let thumbnail: String
    access(self) let royalties: [MetadataViews.Royalty]

    init(
      name: String,
      description: String,
      thumbnail: String,
      royalties: [MetadataViews.Royalty]
    ) {
      self.id = ExampleNFT.totalSupply
      self.name = name
      self.description = description
      self.thumbnail = thumbnail
      self.royalties = royalties

      emit Minted(
        id: self.id,
        name: self.name,
        description: self.description,
        thumbnail: self.thumbnail,
      )

      ExampleNFT.totalSupply = ExampleNFT.totalSupply + 1
    }
  
    pub fun getViews(): [Type] {
      return [
        Type<MetadataViews.Display>(),
        Type<MetadataViews.Royalties>(),
        Type<MetadataViews.Editions>(),
        Type<MetadataViews.ExternalURL>(),
        Type<MetadataViews.NFTCollectionData>(),
        Type<MetadataViews.NFTCollectionDisplay>(),
        Type<MetadataViews.Serial>(),
        Type<MetadataViews.Traits>()
      ]
    }

    pub fun resolveView(_ view: Type): AnyStruct? {
      switch view {
        case Type<MetadataViews.Display>():
          return MetadataViews.Display(
            name: "Example NFT ".concat(self.id.toString()),
            description: "",
            thumbnail: MetadataViews.HTTPFile(
              url: self.thumbnail
            )
          )

        case Type<MetadataViews.Editions>():
          // There is no max number of NFTs that can be minted from this contract
          // so the max edition field value is set to nil
          return MetadataViews.Editions([
            MetadataViews.Edition(
              name: "Example NFT Edition", 
              number: self.id, 
              max: nil
            )
          ])

        case Type<MetadataViews.Serial>():
          return MetadataViews.Serial(self.id)

        case Type<MetadataViews.Royalties>():
          return MetadataViews.Royalties(self.royalties)

        case Type<MetadataViews.ExternalURL>():
          return MetadataViews.ExternalURL("https://s3.us-west-2.amazonaws.com/crypto-piggo.nft/".concat(self.id.toString()).concat(".png"))

        case Type<MetadataViews.NFTCollectionData>():
          return MetadataViews.NFTCollectionData(
            storagePath: ExampleNFT.CollectionStoragePath,
            publicPath: ExampleNFT.CollectionPublicPath,
            providerPath: /private/ExampleNFTCollection,
            publicCollection: Type<&ExampleNFT.Collection>(),
            publicLinkedType: Type<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
            providerLinkedType: Type<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
            createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                return <-ExampleNFT.createEmptyCollection()
            })
          )

        case Type<MetadataViews.NFTCollectionDisplay>():
          let media = MetadataViews.Media(
            file: MetadataViews.HTTPFile(url: "https://ipfs.tenzingai.com/ipfs/QmTpDHw4xDY5a33S6yYXY7MU4C6iRA29mGK3SM1YgnGHY8"),
            mediaType: "image/png"
          )
          return MetadataViews.NFTCollectionDisplay(
            name: "The Example NFT Collection",
            description: "",
            externalURL: MetadataViews.ExternalURL(""),
            squareImage: media,
            bannerImage: media,
            socials: {}
          )

        case Type<MetadataViews.Traits>():
          return MetadataViews.dictToTraits(dict: {}, excludedNames: [])
      }
      return nil
    }

    destroy() {
      emit Burned(id: self.id, address: self.owner?.address)
    }
  }

  pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
    // dictionary of NFT conforming tokens
    // NFT is a resource type with an `UInt64` ID field
    pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

    init () {
      self.ownedNFTs <- {}
    }

    // withdraw removes an NFT from the collection and moves it to the caller
    pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
      let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

      emit Withdraw(id: token.id, from: self.owner?.address)

      return <-token
    }

    // deposit takes a NFT and adds it to the collections dictionary
    // and adds the ID to the id array
    pub fun deposit(token: @NonFungibleToken.NFT) {
      let token <- token as! @ExampleNFT.NFT

      let id: UInt64 = token.id

      // add the new token to the dictionary which removes the old one
      let oldToken <- self.ownedNFTs[id] <- token

      emit Deposit(id: id, to: self.owner?.address)

      destroy oldToken
    }

    // transfer takes an NFT ID and a reference to a recipient's collection
    // and transfers the NFT corresponding to that ID to the recipient
    pub fun transfer(id: UInt64, recipient: &{NonFungibleToken.CollectionPublic}) {
      post {
        self.ownedNFTs[id] == nil: "The specified NFT was not transferred"
        recipient.borrowNFT(id: id) != nil: "Recipient did not receive the intended NFT"
      }

      let nft <- self.withdraw(withdrawID: id)
      
      recipient.deposit(token: <- nft)
    }

    // burn destroys an NFT
    pub fun burn(id: UInt64) {
      post {
        self.ownedNFTs[id] == nil: "The specified NFT was not burned"
      }

      // This will emit a burn event
      destroy <- self.withdraw(withdrawID: id)
    }

    // getIDs returns an array of the IDs that are in the collection
    pub fun getIDs(): [UInt64] {
      return self.ownedNFTs.keys
    }

    // borrowNFT gets a reference to an NFT in the collection
    // so that the caller can read its metadata and call its methods
    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
      if self.ownedNFTs[id] != nil {
        return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
      }
      panic("NFT not found in collection.")
    }

    pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
      if self.ownedNFTs[id] != nil {
        let nft = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT?
        if nft != nil {
          return nft! as! &ExampleNFT.NFT
        }
      }
      panic("NFT not found in collection.")
    }

    destroy() {
        destroy self.ownedNFTs
    }
  }

  // public function that anyone can call to create a new empty collection
  pub fun createEmptyCollection(): @ExampleNFT.Collection {
    return <- create Collection()
  }

  // Resource that an admin or something similar would own to be
  // able to mint new NFTs
  //
  pub resource NFTMinter {
    // mintNFT mints a new NFT with a new ID
    // and deposit it in the recipients collection using their collection reference
    pub fun mintNFT(
      recipient: &{NonFungibleToken.CollectionPublic},
      name: String,
      description: String,
      thumbnail: String,
      royalties: [MetadataViews.Royalty]
    ) {
      // create a new NFT
      let newNFT <- create NFT(
        name: name,
        description: description,
        thumbnail: thumbnail,
        royalties: royalties
      )

      // deposit it in the recipient's account using their reference
      recipient.deposit(token: <-newNFT)
    }
  }

  init() {
    // Initialize the total supply
    self.totalSupply = 0

    // Set the named paths
    self.CollectionStoragePath = /storage/ExampleNFTCollection
    self.CollectionPublicPath = /public/ExampleNFTCollection
    self.MinterStoragePath = /storage/ExampleNFTMinter

    // Create a Collection resource and save it to storage
    let collection <- ExampleNFT.createEmptyCollection()
    self.account.save(<-collection, to: self.CollectionStoragePath)

    // create a public capability for the collection
    self.account.link<&{NonFungibleToken.CollectionPublic}>(
      self.CollectionPublicPath, 
      target: self.CollectionStoragePath
    )

    // Create a Minter resource and save it to storage
    let minter <- create NFTMinter()
    self.account.save(<-minter, to: self.MinterStoragePath)

    emit ContractInitialized()
  }
}
 