'use client'

import { useEffect, useState } from 'react'
import supabase from '../lib/supabaseClient'
import bcrypt from 'bcryptjs'

const ChangePassword = ({ closeModal }) => {
  const [user, setUser] = useState(null)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

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

  const changePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!')
      return
    }

    setLoading(true)

    const validOldPassword = await bcrypt.compare(oldPassword, user.hashed_password)
    if (!validOldPassword) {
      alert('Old password is incorrect!')
      setLoading(false)
      return
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    let { error } = await supabase
      .from('users')
      .update({ hashed_password: hashedPassword })
      .eq('id', user.id)

    setLoading(false)

    if (error) {
      console.error('Error updating password:', error)
      alert('Failed to change password.')
      return
    }

    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    alert('Password changed successfully!')
    closeModal()
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md mx-auto border border-gray-200">
      {/* Header */}
      <h3 className="text-[#820000] text-2xl font-semibold text-center mb-6">Change Password</h3>
  
      {/* Input Fields */}
      <div className="space-y-4">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#820000] bg-gray-50"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#820000] bg-gray-50"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#820000] bg-gray-50"
        />
      </div>
  
      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={changePassword}
          disabled={loading}
          className={`w-full py-2 text-white font-medium rounded-md transition-all 
            ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#820000] hover:bg-[#6a0000]'}`}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
        <button
          onClick={closeModal}
          className="w-full py-2 text-[#820000] border border-[#820000] rounded-md font-medium hover:bg-[#820000] hover:text-white transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );  
}

export default ChangePassword
