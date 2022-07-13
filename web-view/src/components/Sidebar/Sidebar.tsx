import React, { useEffect, useState } from 'react'
import './Sidebar.scss'
import { Link, useLocation } from 'react-router-dom'
import { images } from '../../constants'
import { AuthContext } from '../../common/context'

const sidebarNav = [
    {
        link: '/',
        section: 'home',
        icon: <i className='bx bx-home-alt'></i>,
        text: 'Home'
    },
    {
        link: '/collectors',
        section: 'collectors',
        icon: <i className='bx bx-receipt' ></i>,
        text: 'Collectors'
    },
    {
        link: '/products',
        section: 'products',
        icon: <i className='bx bx-cube'></i>,
        text: 'Products'
    },
    {
        link: '/reports',
        section: 'reports',
        icon: <i className='bx bx-user'></i>,
        text: 'Reports'
    },
    {
        link: '/users',
        section: 'users',
        icon: <i className='bx bx-user'></i>,
        text: 'Users'
    },
    {
        link: '/rewards',
        section: 'rewards',
        icon: <i className='bx bx-user'></i>,
        text: 'Rewards'
    },
    {
        link: '/mrpoints',
        section: 'mrpoints',
        icon: <i className='bx bx-user'></i>,
        text: 'MR Points'
    },
    {
        link: '/materials',
        section: 'materials',
        icon: <i className='bx bx-cube'></i>,
        text: 'Materials'
    },
    {
        link: '/guides',
        section: 'guides',
        icon: <i className='bx bx-user'></i>,
        text: 'Guides'
    },
    {
        link: '/game',
        section: 'game',
        icon: <i className='bx bx-cog'></i>,
        text: 'Game'
    }
]


const sidebarNavCollector = [
    {
        link: '/mrpointskeyin',
        section: 'mrpointskeyin',
        icon: <i className='bx bx-receipt' ></i>,
        text: 'Key In MR Points'
    },
]

const sidebarNavOfficer = [
    {
        link: '/',
        section: 'home',
        icon: <i className='bx bx-home-alt'></i>,
        text: 'Home'
    },
    {
        link: '/collectors',
        section: 'collectors',
        icon: <i className='bx bx-receipt' ></i>,
        text: 'Collectors'
    },
    {
        link: '/products',
        section: 'products',
        icon: <i className='bx bx-cube'></i>,
        text: 'Products'
    },
    {
        link: '/reports',
        section: 'reports',
        icon: <i className='bx bx-user'></i>,
        text: 'Reports'
    },
    // {
    //     link: '/rewards',
    //     section: 'rewards',
    //     icon: <i className='bx bx-user'></i>,
    //     text: 'Rewards'
    // },
    // {
    //     link: '/mrpoints',
    //     section: 'mrpoints',
    //     icon: <i className='bx bx-user'></i>,
    //     text: 'MR Points'
    // },
    // {
    //     link: '/materials',
    //     section: 'materials',
    //     icon: <i className='bx bx-cube'></i>,
    //     text: 'Materials'
    // },
    // {
    //     link: '/guides',
    //     section: 'guides',
    //     icon: <i className='bx bx-user'></i>,
    //     text: 'Guides'
    // },
]

const capitalizeFirstLetter = (string:string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const location = useLocation()

    const { signOut } = React.useContext(AuthContext);

    const [userrole, setUserrole] = useState("");

    //get user role
    const getRole = async () => {
      try {
        const value = await localStorage.getItem('userRole');
        if (value !== null) {
          // We have data!!
          setUserrole(value);
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };
  
      useEffect(() => {
        getRole();
      }, []);

    useEffect(() => {
        const curPath = window.location.pathname.split('/')[1]
        const activeItem = sidebarNav.findIndex(item => item.section === curPath)

        setActiveIndex(curPath.length === 0 ? 0 : activeItem)
    }, [location])

    const closeSidebar = () => {
        let main__content:HTMLElement = document.getElementsByClassName('.main__content')[0] as HTMLElement;
        main__content.style.transform = 'scale(1) translateX(0)'
        setTimeout(() => {
            document.body.classList.remove('sidebar-open')
            // document.querySelector<HTMLElement>('.main__content').style = ''
        }, 500);
    }

    return (
        <div className='sidebar'>
            <div className="sidebar__logo" style={{backgroundColor:"#FC8B10"}}>
                {/* <img src={images.logo} alt="" />
                <div className="sidebar-close" onClick={closeSidebar}>
                    <i className='bx bx-x'></i>
                </div> */}
                {userrole === "admin" && <h5 style={{color:"black"}}>Admin Panel</h5>}
                {userrole === "officer" && <h5 style={{color:"black"}}>JPSPN Officer Panel</h5>}
                {userrole === "head" && <h5 style={{color:"black"}}>JPSPN Head of Officer Panel</h5>}
            </div>
            <div className="sidebar__menu">
                { userrole === "collector" ?
                    sidebarNavCollector.map((nav, index) => (
                        <Link to={nav.link} key={`nav-${index}`} className={`sidebar__menu__item ${activeIndex === index && 'active'}`} onClick={closeSidebar}>
                            <div className="sidebar__menu__item__icon">
                                {nav.icon}
                            </div>
                            <div className="sidebar__menu__item__txt">
                                {nav.text}
                            </div>
                        </Link>
                    ))
                :<></>}
                { userrole !== "admin" ?
                    sidebarNavOfficer.map((nav, index) => (
                        <Link to={nav.link} key={`nav-${index}`} className={`sidebar__menu__item ${activeIndex === index && 'active'}`} onClick={closeSidebar}>
                            <div className="sidebar__menu__item__icon">
                                {nav.icon}
                            </div>
                            <div className="sidebar__menu__item__txt">
                                {nav.text}
                            </div>
                        </Link>
                    ))
                :
                    sidebarNav.map((nav, index) => (
                        <Link to={nav.link} key={`nav-${index}`} className={`sidebar__menu__item ${activeIndex === index && 'active'}`} onClick={closeSidebar}>
                            <div className="sidebar__menu__item__icon">
                                {nav.icon}
                            </div>
                            <div className="sidebar__menu__item__txt">
                                {nav.text}
                            </div>
                        </Link>
                    ))
                }
                <div className="sidebar__menu__item">
                    <div className="sidebar__menu__item__icon">
                        <i className='bx bx-log-out'></i>
                    </div>
                    <div className="sidebar__menu__item__txt">
                        <a onClick={signOut}>
                        Logout
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar