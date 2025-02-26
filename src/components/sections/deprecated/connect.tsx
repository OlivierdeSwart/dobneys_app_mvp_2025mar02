import { useAccount, useConnect, useDisconnect } from 'wagmi'

function Connect() {
    const { connectors, connect, status, error } = useConnect()

    return (

        <div>
            <h2>------------</h2>
        <h2>Connect</h2>
        {connectors.map((connector) => (
        <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
        >
            {connector.name}
        </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
        <h2>------------</h2>
        </div>
    )
}

export default Connect
