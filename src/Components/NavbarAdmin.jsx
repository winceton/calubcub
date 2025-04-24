import React from 'react'
import Sidebar from './Sidebar'
import { useState } from 'react'

const Navbar = ({ route, routeName1, routeName2, routeName3, studentId, teacherId }) => {
  const [sidebar, setSidebar] = useState(false)

//   const toggleSidebar = () => {
//     setSidebar(!sidebar)
//   } Currently unused

  return (
    <div className='fixed top-0 left-0 w-full p-[2rem] bg-white shadow-md z-10'>
        <ul className='flex items-center justify-center gap-[3rem]'>
        {/* <li><div className='select-none text-black font-bold'>Home</div></li>
        <li><div className='select-none text-black font-bold'>About Us</div></li>
        <li><div className='select-none text-black font-bold'>Categories</div></li>
        <li><div className='select-none text-black font-bold'>Contacts</div></li>  */}
        {/* These are sample nav links */}
        </ul>
        <Sidebar sidebar={sidebar} route={route} routeName1={routeName1} routeName2={routeName2} routeName3={routeName3} studentId={studentId} teacherId={teacherId} />
    </div>
  )
}

export default Navbar