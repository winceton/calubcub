'use client'
import React, { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'
import NavbarAdmin from '../../../Components/NavbarAdmin'
import { useRouter } from 'next/navigation'
import GenerateSF1 from '../../forms/SF1'
import GenerateSF5 from '../../forms/SF5'

const page = () => {

  const [sectionID, setSectionID] = useState(null)
  const [section, setSection] = useState({})

  const [SF1Modal, setSF1Modal] = useState(false)
  const [SF5Modal, setSF5Modal] = useState(false)

  const fetchSection = async () => {
    let { data, error } = await supabase
      .from('section')
      .select('*, adviser(first_name, middle_name ,last_name)')
      .eq('id', sectionID)
      .single()
      
    setSection(data)

    if (error) {
      console.error('Error fetching user:', error)
      return
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    const userRole = localStorage.getItem('role')
    const section = JSON.parse(localStorage.getItem('section')) || {}

    setSectionID(section.id)
  }, [])

  useEffect(() => {
    if (sectionID) {
      fetchSection();
    }
  }, [sectionID]);

  return (
    <div className='ml-[8rem] mt-[5rem] flex items-center gap-16'>
      <NavbarAdmin route={'teacher'} routeName1={'downloads'} />
      <div>(SF 1) School Form 1 School Register</div> <button onClick={() => { setSF1Modal(true) }}>download</button>
      <div>(SF 5) School Form 5 Report on Promotion and Learning Progress & Achievement</div><button onClick={() => { setSF5Modal(true) }}>download</button>


      {/* {section && (
        <>
          {section.class_id <= 10 ? (
            <>
              <div>(SF9) JHS Learners Progress Report Card</div>
              <button>download</button>
            </>
          ) : (
            <>
              <div>(SF9) SHS Learners Progress Report Card</div>
              <button>download</button>
            </>
          )}
        </>
      )} */}



      {SF1Modal && (
        <GenerateSF1
          onClose={() => { setSF1Modal(false) }}
          section={{ name: section.section_name || 'N/A', classid: section.class_id || null, id: section.id }}
          teacherName={`${section.adviser?.first_name || ''} ${section.adviser?.middle_name || ''} ${section.adviser?.last_name || ''}`.trim()} />
      )}

      {SF5Modal && (
        <GenerateSF5
          onClose={() => { setSF5Modal(false) }} section={section} />
      )}

    </div>
  )
}

export default page