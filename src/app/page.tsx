'use client'

import Account from '../components/sections/account'
import Connect from '../components/sections/connect'
import GreetingReader from '../components/sections/blockchainreader'
import GreetingWriter from '../components/sections/write_to_contract'
import Navbar from '../components/shared/navbar'
import { Button } from "@/components/ui/button"


function App() {

  return (
    <>
      <Navbar />
    <p/>
      <Account />
    <p/>
      <Connect />
    <p/>
      <GreetingReader />
    <p/>
      <GreetingWriter />
    <p/>
    <div>
      <Button variant="destructive">Delete</Button>  // Red destructive button
      <Button variant="outline">Outline</Button>  // Bordered button
      <Button size="lg">Large Button</Button>  // Bigger button
    </div>
    </>
  )
}

export default App
