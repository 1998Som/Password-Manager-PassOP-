import Navbar from './components/Navbar'
import './App.css'
import Manager from './components/Manager'
import Footer from './components/Footer'
import LandingPage from './components/LandingPage'
import { SignedIn, SignedOut } from "@clerk/clerk-react"

function App() {
  return (
    <>
      <Navbar />
      <SignedIn>
        <div className="mt-10 sm:mt-10">
          <Manager />
        </div>
      </SignedIn>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <Footer />
    </>
  )
}

export default App
