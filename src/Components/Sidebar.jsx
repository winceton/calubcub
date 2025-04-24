import React from 'react'

import { RiAccountCircleFill as Account } from "react-icons/ri";
import { MdDashboard as Dashboard } from "react-icons/md";
import { GoDot as Dot } from "react-icons/go";
import { CiLogout as Logout } from "react-icons/ci";
import { FaChalkboardTeacher as Teacher, FaRegClipboard as Classes } from "react-icons/fa";
import { PiStudentBold as Attendance } from "react-icons/pi";
import { SiGoogleclassroom as Class } from "react-icons/si";
import { FaUserGraduate as Grades } from "react-icons/fa6";
import { GrVmMaintenance as Maintenance } from "react-icons/gr";
import { FiDownload as Downloads } from "react-icons/fi";
import { IoShieldCheckmarkOutline as Admission } from "react-icons/io5";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Sidebar = ({ sidebar, route, routeName1, routeName2, routeName3, studentId, teacherId }) => {
  const router = useRouter()
  const [account, setAccount] = useState(false)
  const [grades, setGrades] = useState(false)
  const [dashboard, setDashboard] = useState(true)
  const [sf1, setSf1] = useState(false)
  const [sf2, setSf2] = useState(false)
  const [teachers, setTeachers] = useState(false)
  const [attendance, setAttendance] = useState(false)
  const [maintenance, setMaintenance] = useState(false)
  const [classes, setClasses] = useState(false)
  const [downloads, setDownloads] = useState(false)
  const [admission, setAdmission] = useState(false)

  const [logoutModalVisible, setLogoutModalVisible] = useState(false)

  // Image slide effect
  const images = [
    '../../../../../img/school-logo.png',
    '../../../../../img/jhs-logo.png'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 400); // Match this with animation duration
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  const accountActive = () => {
    setAccount(true)
    router.push(`/${route}/profile`)

    // set others to false
    setDashboard(false)
    setSf1(false)
    setSf2(false)
    setTeachers(false)
    setAttendance(false)
    setGrades(false)
    setMaintenance(false)
    setClasses(false)
    setDownloads(false)
    setAdmission(false)
  }

  const gradesActive = () => {
    setGrades(true)
    router.push(`/${route}/grades`)

    // set others to false
    setDashboard(false)
    setSf1(false)
    setSf2(false)
    setTeachers(false)
    setAttendance(false)
    setAccount(false)
    setMaintenance(false)
    setClasses(false)
    setDownloads(false)
    setAdmission(false)
  }

  const dashboardActive = () => {
    setDashboard(true)
    router.push(`/${route}`)

    // set others to false
    setAccount(false)
    setSf1(false)
    setSf2(false)
    setTeachers(false)
    setAttendance(false)
    setGrades(false)
    setMaintenance(false)
    setClasses(false)
    setDownloads(false)
    setAdmission(false)
  }

  const sf1Active = () => {
    setSf1(true)
    router.push(`/${route}/class`)

    // set others to false
    setDashboard(false)
    setAccount(false)
    setTeachers(false)
    setSf2(false)
    setAttendance(false)
    setGrades(false)
    setMaintenance(false)
    setClasses(false)
    setDownloads(false)
    setAdmission(false)
  }

  const sf2Active = () => {
    setSf2(true)
    router.push(`/${route}/attendance`)

    // set others to false
    setDashboard(false)
    setAccount(false)
    setTeachers(false)
    setSf1(false)
    setAttendance(false)
    setGrades(false)
    setMaintenance(false)
    setClasses(false)
    setDownloads(false)
    setAdmission(false)
  }

  const teachersActive = () => {
    setTeachers(true)
    router.push(`/${route}/teachers`)

    // set others to false
    setDashboard(false)
    setAccount(false)
    setSf1(false)
    setAttendance(false)
    setGrades(false)
    setMaintenance(false)
    setClasses(false)
    setDownloads(false)
    setAdmission(false)
  }

  const attendanceActive = () => {
    setAttendance(true)
    router.push(`/${route}/attendance`)

    // set others to false
    setDashboard(false)
    setAccount(false)
    setSf1(false)
    setTeachers(false)
    setGrades(false)
    setMaintenance(false)
    setClasses(false)
    setDownloads(false)
    setAdmission(false)
  }

  const maintenanceActive = () => {
    setMaintenance(true)
    router.push(`/${route}/maintenance`)

    // set others to false
    setDashboard(false)
    setAccount(false)
    setSf1(false)
    setTeachers(false)
    setGrades(false)
    setAttendance(false)
    setClasses(false)
    setDownloads(false)
    setAdmission(false)
  }

  const classesActive = () => {
    setClasses(true)
    router.push(`/${route}/classes`)

    // set others to false
    setDashboard(false)
    setAccount(false)
    setSf1(false)
    setTeachers(false)
    setGrades(false)
    setAttendance(false)
    setMaintenance(false)
    setDownloads(false)
    setAdmission(false)
  }

  const downloadsActive = () => {
    setDownloads(true)
    if (route === 'teacher') {
      router.push(`/${route}/downloads`)
    } else {
      router.push(`/${route}/list`)
    }


    // set others to false
    setDashboard(false)
    setAccount(false)
    setSf1(false)
    setTeachers(false)
    setGrades(false)
    setAttendance(false)
    setMaintenance(false)
    setClasses(false)
    setAdmission(false)
  }

  const admissionActive = () => {
    setAdmission(true)
    router.push(`/${route}/admission`)

    // set others to false
    setDashboard(false)
    setAccount(false)
    setSf1(false)
    setTeachers(false)
    setGrades(false)
    setAttendance(false)
    setMaintenance(false)
    setClasses(false)
    setDownloads(false)
  }

  // LOGOUT 
  const handleLogout = () => {
    localStorage.clear()
    router.replace('/')
  }

  const logoutModal = () => {
    setLogoutModalVisible(true)
  }

  return (
    <div className='fixed top-0 left-0 bottom-0 flex'>
      <div className={`flex flex-col justify-between bg-[#820000] z-[1] w-[3.5rem] md:w-[5rem]`}>
        <div className='fixed top-[.75rem] left-[1.1rem] flex items-center gap-8 bg-red text-black z-10'>
          {/* <img src="../../../img/school-logo.png" alt="calubcub-logo" className='relative h-[3rem]' /> */}
          {/* School Logo */}
          <img
            src={images[currentImageIndex]}
            alt="school logo"
            className={`slider-image ${fade ? 'fade-in' : 'fade-out'} relative h-[3rem] drop-shadow-md`}
          />
          <div className='capitalize text-2xl'>
            {routeName3 ?
              (
                <div>
                  <span className='text-blue-600 underline cursor-pointer' onClick={() => router.push(`/${route}/${routeName1}`)}>
                    {routeName1}
                  </span> &gt;&nbsp;
                  <span className='text-blue-600 underline cursor-pointer' onClick={() => router.push(`/${route}/${routeName1}/${routeName2}/${studentId ? studentId : teacherId}`)}>
                    {routeName2}
                  </span>
                  &nbsp;&gt; {routeName3}
                </div>
              ) : routeName2 ? (
                <div>
                  <span className='text-blue-600 underline cursor-pointer' onClick={() => router.push(`/${route}/${routeName1}`)}> {routeName1}</span> &gt; {routeName2}
                </div>) : routeName1 ? `${routeName1}` : ``}
          </div>
        </div>
        <div className='w-full'>
          <div className='w-full'>
            <div className={`p-4 py-5 opacity-0 pointer-events-none select-none`}>
              <Dot className={`text-3xl ${sidebar ? 'relative left-3' : ''}`} />
              {/* Nothing */}
            </div>
          </div>

          {/* Buttons */}
          <div className='w-full'>
            <div className={`flex items-center text-xs md:text-sm p-6 cursor-pointer ${routeName1 === 'Account' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={accountActive}>
              <Account className={`text-xl md:text-3xl`} />
              Account
            </div>
            {route === 'student' && (
              <div className={`flex items-center text-xs md:text-sm p-6 cursor-pointer ${routeName1 === 'Grades' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={gradesActive}>
                <Grades className={`text-xl md:text-3xl`} />
                Grades
              </div>
            )}
            {route === 'teacher' && (
              <div>
                <div className={`flex items-center text-xs md:text-sm p-6 cursor-pointer ${routeName1 === 'class' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={sf1Active}>
                  <Class className={`text-xl md:text-3xl`} />
                  Class
                </div>
                <div className={`flex items-center text-xs md:text-sm p-6 cursor-pointer ${routeName1 === 'Attendance' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={sf2Active}>
                  <Attendance className={`text-xl md:text-3xl`} />
                  Attendance
                </div>
                <div className={`flex items-center text-xs md:text-sm p-6 cursor-pointer ${routeName1 === 'downloads' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={downloadsActive}>
                  <Downloads className={`text-xl md:text-3xl`} />
                  Downloads
                </div>

              </div>
            )}
            {route === 'admin' && (
              <div>
                <div className={`flex items-center text-xs md:text-sm p-6 cursor-pointer ${routeName1 === 'teachers' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={teachersActive}>
                  <Teacher className={`text-xl md:text-3xl`} />
                  Teachers
                </div>
                <div className={`flex items-center text-xs p-6 cursor-pointer ${routeName1 === 'attendance' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={attendanceActive}>
                  <Attendance className={`text-xl md:text-3xl`} />
                  Attendance
                </div>
                <div className={`flex items-center text-xs p-6 cursor-pointer ${routeName1 === 'maintenance' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={maintenanceActive}>
                  <Maintenance className={`text-xl md:text-3xl`} />
                  Maintenance
                </div>
                <div className={`flex items-center text-xs p-6 cursor-pointer ${routeName1 === 'classes' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={classesActive}>
                  <Classes className={`text-xl md:text-3xl`} />
                  Classes
                </div>

              </div>
            )}
            {route === 'officer' && (
              <div>
                <div className={`flex items-center text-xs md:text-sm p-6 cursor-pointer ${routeName1 === 'admission' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={admissionActive}>
                  <Admission className={`text-xl md:text-3xl`} />
                  Admission
                </div>
                <div className={`flex items-center text-xs md:text-sm p-6 cursor-pointer ${routeName1 === 'downloads' ? 'bg-[#FAF9F6] text-black hover:bg-opacity-90' : 'bg-[transparent] text-white hover:bg-[#972929]'} w-full rounded-l-2xl ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={downloadsActive}>
                  <Downloads className={`text-xl md:text-3xl`} />
                  Downloads
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='w-full'>
          <div className={`flex items-center text-xs p-4 hover:bg-red-600 hover:text-white cursor-pointer w-full text-white ${sidebar ? 'flex-row gap-4' : 'flex-col'} select-none`} onClick={logoutModal}>
            <Logout className={`text-2xl`} />
            Logout
          </div>
        </div>
        {logoutModalVisible ? (
          <div className='fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-black/70 z-[100]' onClick={() => setLogoutModalVisible(false)}>
            <div className='bg-white rounded-lg p-6' onClick={(e) => e.stopPropagation()}>
              <div className='flex flex-col gap-2 justify-center items-center select-none'>
                <div>
                  Are you sure you want to log out?
                </div>
                <div className='flex gap-6'>
                  <div className='rounded-md py-2 px-4 bg-[#820000] hover:bg-[#972929] transition-all text-white cursor-pointer' onClick={handleLogout}>
                    Yes
                  </div>
                  <div className='rounded-md py-2 px-4 bg-[#820000] hover:bg-[#972929] transition-all text-white cursor-pointer' onClick={() => setLogoutModalVisible(false)}>
                    No
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : ''}
      </div>
    </div>
  )
}

export default Sidebar