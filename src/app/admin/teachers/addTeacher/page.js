'use client'

import React, { useState, useEffect } from 'react'
import supabase from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import bcrypt from 'bcryptjs'
import NavbarAdmin from '../../../../Components/NavbarAdmin'

const addTeacher = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState([])
  const [filteredSections, setFilteredSections] = useState([])

  const [newUser, setNewUser] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    school_id: '',
    role: 'teacher',
    class_id: '',
    section_name: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchSections = async () => {
      const { data, error } = await supabase
        .from('section')
        .select('*')
      if (error) console.error('Error fetching sections:', error)
      else
        setSections(data)
    }
    fetchSections()
  }, [])

  useEffect(() => {
    if (newUser.class_id) {
      setFilteredSections(sections.filter(section => section.class_id == newUser.class_id))
    } else {
      setFilteredSections([])
    }
  }, [newUser.class_id, sections])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUser(prev => ({ ...prev, [name]: value }))
  }

  const handlePhoneNumberChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, '')
    setNewUser((prev) => ({ ...prev, phone_number: numericValue }))
  }

  const addUser = async () => {
    setLoading(true)
    setErrors({})

    const requiredFields = ['first_name', 'middle_name', 'last_name', 'email', 'phone_number', 'school_id', 'role']
    const newErrors = requiredFields.reduce((acc, field) => {
      if (!newUser[field]) acc[field] = `${field.replace('_', ' ')} is required.`
      return acc
    }, {})

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (newUser.email && !emailRegex.test(newUser.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('school_id')
        .eq('school_id', newUser.school_id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existingUser) {
        setErrors({ school_id: 'School ID already exists' })
        setLoading(false)
        return
      }

      const hashedPassword = await bcrypt.hash(newUser.school_id, 10)

      const { error } = await supabase.from('users').insert([
        {
          first_name: newUser.first_name,
          middle_name: newUser.middle_name,
          last_name: newUser.last_name,
          email: newUser.email,
          phone_number: newUser.phone_number,
          school_id: newUser.school_id,
          role: newUser.role,
          hashed_password: hashedPassword,
          isDeleted: false
        }
      ])

      if (error) throw error

      if (newUser.class_id && newUser.section_name) {
        const { error: updateError } = await supabase
          .from('section')
          .update({ adviser: newUser.school_id })
          .match({ class_id: newUser.class_id, section_name: newUser.section_name })

        if (updateError) throw updateError
      }

      setNewUser({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        school_id: '',
        role: '',
        class_id: '',
        section_name: ''
      })
      setErrors({})
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-6 mt-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 border-t-4 border-[#820000] sm:p-8">
        <NavbarAdmin route={'admin'} routeName1={'teachers'} routeName2={'Add'} /> 
        <h2 className="text-2xl font-semibold text-[#820000] mb-6 text-center sm:text-left">Add Teacher</h2>
        <fieldset className="space-y-4">
          {[  
            { label: 'First Name', name: 'first_name' },
            { label: 'Middle Name', name: 'middle_name' },
            { label: 'Last Name', name: 'last_name' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'School ID', name: 'school_id' }
          ].map(({ label, name, type = 'text' }) => (
            <div key={name}>
              <label className="block text-gray-600 font-medium">{label}</label>
              <input
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#820000] focus:outline-none"
                type={type}
                name={name}
                value={newUser[name]}
                onChange={handleInputChange}
              />
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}
  
          {/* Grade Level Dropdown */}
          <div>
            <label className="block text-gray-600 font-medium">Grade Level</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#820000] focus:outline-none"
              name="class_id"
              value={newUser.class_id}
              onChange={handleInputChange}
            >
              <option value="">Select Grade Level</option>
              {[7, 8, 9, 10, 11, 12].map((grade) => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
            {errors.class_id && <p className="text-red-500 text-sm mt-1">{errors.class_id}</p>}
          </div>
  
          {/* Section Dropdown */}
          <div>
            <label className="block text-gray-600 font-medium">Section</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#820000] focus:outline-none"
              name="section_name"
              value={newUser.section_name}
              onChange={handleInputChange}
              disabled={!newUser.class_id}
            >
              <option value="">Select Section</option>
              {filteredSections.map((section) => (
                <option key={section.id} value={section.section_name}>{section.section_name}</option>
              ))}
            </select>
            {errors.section_name && <p className="text-red-500 text-sm mt-1">{errors.section_name}</p>}
          </div>
  
          {/* Phone Number Input */}
          <div>
            <label className="block text-gray-600 font-medium">Phone Number</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#820000] focus:outline-none"
              type="text"
              maxLength={12}
              name="phone_number"
              value={newUser.phone_number}
              onChange={handlePhoneNumberChange}
            />
            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
          </div>
        </fieldset>
  
        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button 
            onClick={addUser} 
            className="px-6 py-2 bg-[#820000] text-white rounded shadow hover:bg-red-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </div>
  
        {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general}</p>}
      </div>
    </div>
  );
}

export default addTeacher
