'use client'

import NFTCreationForm from "../../components/sections/nft_mint_form";
import ImageUploadForm from "../../components/sections/ImageUploadForm";

function NftCreation() {

  return (
    <>
    <div className="p-6">
      <h1 className="text-center text-3xl font-bold mb-6">NFT Creation</h1>
      {/* <NFTCreationForm /> */}
      <ImageUploadForm/>
    </div>
    </>
  )
}

export default NftCreation
