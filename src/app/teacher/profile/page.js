'use client'

import { useEffect, useState } from 'react'
import supabase from '../../../app/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import ChangePassword from '../../accountManagement/ChangePassword'
import NavbarAdmin from '../../../Components/NavbarAdmin'
import ChangeProfilePicture from '../../accountManagement/ChangeProfilePicture'

import { FiMail as Mail, FiPhone as Phone, FiUser as User, FiCreditCard as CreditCard } from "react-icons/fi";
import { IoPersonCircleOutline as DefaultPic } from "react-icons/io5";
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai";

const UserProfile = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const fetchUser = async () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) return

    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return
    }
    setUser(data)
  }

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    const userRole = localStorage.getItem('role')

    if (!userId || !userRole) {
      router.replace('/')
    } else if (userRole === 'admin') {
      router.replace('/admin')
    }

    fetchUser()
  }, [])

  return (
    <div className='ml-[8rem] mt-[5rem] flex items-center gap-16'>
      <NavbarAdmin route={'teacher'} routeName1={'Account'} />

      {user ? (
        <div className="flex lg:flex-row flex-col items-center gap-6 lg:gap-16">
          {/* Profile Picture */}
          <div className="flex flex-col items-center relative">
            <button onClick={() => setIsImageModalOpen(true)} className="w-[15rem] h-[15rem] rounded-lg overflow-hidden">
              {user?.profile_picture ? (
                <img
                  src={`${user.profile_picture}?t=${new Date().getTime()}`}
                  alt="Profile"
                  className="h-[90%] object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <DefaultPic className="text-[12rem]" />
                </div>
              )}
            </button>
            <button onClick={() => setIsPasswordModalOpen(true)} className="absolute -bottom-12 left-1 mt-6 text-lg font-bold bg-[#820000] text-white px-3 py-1 rounded-md shadow-md transition-all hover:bg-[#972929]">
              CHANGE PASSWORD
            </button>
          </div>

          {/* User Info */}
          <div className="bg-white p-6 lg:p-8 rounded-xl shadow-md border border-gray-200 text-gray-800 w-full mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-6">
              <div className="text-center lg:text-left">
                <h2 className="font-bold text-[#820000] text-2xl lg:text-4xl">
                  {user.last_name} {user.first_name} {user.middle_name}
                </h2>
                <p className="text-gray-600 text-lg lg:text-xl font-medium capitalize">
                  {user.role === "admin" ? "Administrator" : user.role}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
              <div className="flex items-center gap-3">
                <Mail className="text-[#820000]" size={20} />
                <p className="text-gray-700 text-lg">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-[#820000]" size={20} />
                <p className="text-gray-700 text-lg">
                  {user.phone_number || <span className="italic text-gray-500">No phone number</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="text-[#820000]" size={20} />
                <p className="text-gray-700 text-lg">School ID: {user.school_id}</p>
              </div>
              {user.class_id && (
                <div className="flex items-center gap-3">
                  <User className="text-[#820000]" size={20} />
                  <p className="text-gray-700 text-lg">Class: {user.class_id}</p>
                </div>
              )}
              {user.section_name && (
                <div className="flex items-center gap-3">
                  <User className="text-[#820000]" size={20} />
                  <p className="text-gray-700 text-lg">Section: {user.section_name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='fixed top-0 left-0 bottom-0 right-0 bg-black/70 z-40'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <Loader className='loading-circle text-6xl text-[#d62b2b] z-50' />
          </div>
        </div>
      )}

      {/* Profile Picture Modal */}
      {isImageModalOpen && (
        <ChangeProfilePicture
          user={user}
          setUser={setUser}
          closeModal={() => setIsImageModalOpen(false)}
        />
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
          >
            <ChangePassword closeModal={() => setIsPasswordModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile
