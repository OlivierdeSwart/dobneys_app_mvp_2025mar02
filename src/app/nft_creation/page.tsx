'use client'

// import NFTMintForm from "../../components/sections/nft_mint_form";
// import ImageUploadForm from "../../components/sections/ImageUploadForm";
import NFTCreationForm from "../../components/sections/NFTCreationForm";

function NftCreation() {

  return (
    <>
    <div className="p-6">
      <h1 className="text-center text-3xl font-bold mb-6">NFT Creation</h1>
      {/* <NFTMintForm /> */}
      {/* <ImageUploadForm/> */}
      <NFTCreationForm/>
    </div>
    </>
  )
}

export default NftCreation
