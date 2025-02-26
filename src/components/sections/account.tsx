'use client'

import { useAccount, useDisconnect } from 'wagmi'

function Account() {
    const account = useAccount()
    const { disconnect } = useDisconnect()
  
    return (
      
        <div>
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
          <h2>Account</h2>
  
          <div>
            status: {account.status}
            <br />
            addresses: {JSON.stringify(account.addresses)}
            <br />
            chainId: {account.chainId}
          </div>
  
          {account.status === 'connected' && (
            <button type="button" onClick={() => disconnect()}>
              Disconnect
            </button>
          )}
        </div>
    )
}

export default Account
