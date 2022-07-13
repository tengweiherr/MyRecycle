import React from 'react'
import './MainLayout.scss'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar' 
import TopNav from '../components/topnav/TopNav'

const MainLayout = () => {
    return (
        <>
            <Sidebar />
            <div className="main">
                <div className="main__content">
                    {/* <TopNav/> */}
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default MainLayout
