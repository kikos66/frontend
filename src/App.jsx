import { Route, Routes } from 'react-router-dom'
import Navbar from './Navbar'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="*" element={ <NotFound/> }></Route>

        <Route path="/" element={ <Home/> }></Route>
        <Route path="/AboutUs" element={ <AboutUs/> }></Route>
        <Route path="/Login" element={ <Login/> }></Route>
        <Route path="/Register" element={ <Register/> }></Route>
        <Route path="/Profile" element={ <Profile/> }></Route>
      </Routes>
    </>
  )
}

export default App
