'use client'

import NFTCreationForm from "../../components/sections/nft_mint_form";

function NftCreation() {

  return (
    <>
    <h1 className="text-center p-10 text-3xl font-bold">
        NFT Creation
    </h1>
    <div className="p-6">
      <h1 className="text-center text-3xl font-bold mb-6">NFT Creation</h1>
      <NFTCreationForm />
    </div>
    </>
  )
}

export default NftCreation
