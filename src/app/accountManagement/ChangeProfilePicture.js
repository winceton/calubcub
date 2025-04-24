'use client'

import { useState } from 'react'
import supabase from '../../app/lib/supabaseClient'

const ChangeProfilePicture = ({ user, setUser, closeModal }) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed')
      return
    }

    setUploading(true)
    setError('')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}.${fileExt}`
    const filePath = `${fileName}`

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('profile_picture')
      .eq('id', user.id)
      .single()

    if (userError) {
      setError('Error fetching user data')
    } else if (userData?.profile_picture) {
      const oldFileName = userData.profile_picture.split('/').pop()
      if (oldFileName) {
        const { error: deleteError } = await supabase.storage
          .from('profile_picture')
          .remove([oldFileName])

        if (deleteError) {
          console.error('Error deleting old profile picture:', deleteError)
        }
      }
    }

    const { data, error } = await supabase.storage
      .from('profile_picture')
      .upload(filePath, file, { upsert: true })

    if (error) {
      setError('Error uploading file. Please try again.')
    } else {

      const { data: publicUrlData } = supabase.storage
        .from('profile_picture')
        .getPublicUrl(filePath)

      const publicUrl = publicUrlData.publicUrl

      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: publicUrl })
        .eq('id', user.id)

      if (updateError) {
        setError('Error updating profile picture. Please try again.')
      } else {
        setUser((prev) => ({ ...prev, profile_picture: publicUrl }))
        closeModal()
      }
    }

    setUploading(false)
  }

  const handleReset = async () => {
    if (!user.profile_picture) return

    setUploading(true)
    setError('')

    const oldFileName = user.profile_picture.split('/').pop()

    if (oldFileName) {
      const { error: deleteError } = await supabase.storage
        .from('profile_picture')
        .remove([oldFileName])

      if (deleteError) {
        setError('Error deleting profile picture.')
        setUploading(false)
        return
      }
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture: null })
      .eq('id', user.id)

    if (updateError) {
      setError('Error updating user profile.')
    } else {
      setUser((prev) => ({ ...prev, profile_picture: null }))
      closeModal()
    }

    setUploading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
      <div
        className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-[90%] max-w-md text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Title */}
        <h3 className="text-[#820000] text-2xl font-semibold mb-4">Upload Profile Picture</h3>
  
        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#820000] bg-gray-50"
        />
  
        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  
        {/* Uploading Message */}
        {uploading && <p className="text-gray-600 text-sm mt-2">Processing...</p>}
  
        {/* Buttons */}
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-[#820000] border border-[#820000] rounded-md font-medium hover:bg-[#820000] hover:text-white transition-all"
          >
            Close
          </button>
          <button
            onClick={handleReset}
            disabled={!user.profile_picture || uploading}
            className={`px-4 py-2 font-medium rounded-md transition-all ${
              !user.profile_picture || uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#820000] text-white hover:bg-[#6a0000]'
            }`}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );  
}

export default ChangeProfilePicture
