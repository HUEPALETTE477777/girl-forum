
import './App.css'
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <div>
        <Navbar />
        <Outlet/>
        <Footer />
      </div>
    </>
  )
}

export default App
