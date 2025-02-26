import Link from "next/link";
import LoginButton from "./login_button";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between bg-[#f5f5dc] w-full h-[60px] px-6 shadow-md">
            {/* Left: Brand Name */}
            <h1 className="text-xl font-bold">Dobney's</h1>

            {/* Center: Navigation Links */}
            <div className="flex space-x-6">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="/nft_creation" className="hover:underline">NFT Creation</Link>
                <Link href="/nft_overview" className="hover:underline">NFT Overview</Link>
            </div>

            {/* Right: Wallet Connect Button */}
            {/* <button className="border-black border-2 rounded-md px-4 py-2 hover:bg-gray-200">
                Login to Wallet
            </button> */}
            <LoginButton/>
        </nav>
    );
}
