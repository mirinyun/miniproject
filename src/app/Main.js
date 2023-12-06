import TailFooter from "../comm/TailFooter"
import FoodList from "./FoodList"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import RouteNav from "../comm/RouteNav"
import Login from "./Login"
import Mycalorie from "./Mycalorie"
import Signup from "./Signup"
import Profile from "./Profile"
import MycalorieInsert from "./MycalorieInsert"
import MycalorieView from "./MycalorieView"
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    IconButton,
    Card,
  } from "@material-tailwind/react";
import CalCalrorie from "./CalCalorie"
  
const Main = () => {
    return (
        <BrowserRouter>
        <div className="flex flex-col w-full mx-auto h-screen">
            <RouteNav/>

            <article className='grow flex flex-col m-0 bg-gray-50'>
                <Routes>
                    <Route path="/mycalorie" element={<Mycalorie/>}/>
                    <Route path="/mycalorieinsert" element={<MycalorieInsert/>}/>
                    <Route path="/mycalorieview" element={<MycalorieView/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                </Routes>
                <CalCalrorie/>
            </article>
            <TailFooter />
        </div>
    </BrowserRouter>
    )
}

export default Main