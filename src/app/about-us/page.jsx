import React from 'react'
import Navbar from '../../Components/Navbar'
import BecomeOneOfUs from '../../Components/BecomeOneOfUs'
import AboutUs from '../../Components/AboutUs'
import Faculty from '../../Components/Faculty'
import ServicesPage from '../../Components/ServicesPage'

const page = () => {
  return (
    <div className="bg-white text-[#820000] font-sans scroll-smooth mt-[4rem]">
      <Navbar logoHidden={true} />

      <AboutUs />
      <BecomeOneOfUs />
      {/* <Faculty /> */}
      {/* <ServicesPage /> */}
      
      {/* Footer */}
      {/* <footer className="bg-[#820000] text-white text-center py-6 mt-20">
        <p className="text-sm">&copy; {new Date().getFullYear()} Calubcub 1.0 National High School. All rights reserved.</p>
      </footer> */}
    </div>
  )
}

export default page