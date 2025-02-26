import { useConnect, injected } from 'wagmi'
import { type WalletConnectParameters } from 'wagmi/connectors'
import { walletConnect } from 'wagmi/connectors'
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Navbar() {
    const { connect, connectors } = useConnect()

    return (
        <div className="flex items-center justify-between bg-[#f5f5dc] w-screen h-[60px]">
            <h1 className="">Dobney's</h1>
            <div className="">
                Hello
            </div>
            <button 
                className="border-black border-2 rounded-md p-2 m-2"
                // onClick={() => console.log("button click registered")} 
                // onClick={() => connect({ connector: walletConnect() })}
                onClick={() => connect({ connector: connectors[2] })}
                >
                Connect
            </button>
            {/* {connectors.map((connector) => (
                    <button
                        key={connector.id}
                        className="border-black border-2 rounded-md p-2 m-2"
                        onClick={() => connect({ connector })}
                    >
                        {connector.name}
                    </button>
                ))} */}
            <ConnectButton />
        </div>
    );
}

export default Navbar
