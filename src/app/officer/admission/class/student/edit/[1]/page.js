'use client'
import React, { useState, useEffect } from 'react'
import supabase from '../../../../../../lib/supabaseClient'
import NavbarAdmin from '../../../../../../../Components/NavbarAdmin'
import { useRouter, useParams } from 'next/navigation'

import { FaUser, FaPhone, FaHome, FaTransgender, FaCalendarAlt, FaAddressCard } from 'react-icons/fa';

const editStudent = () => {

  const defaultStudent = {
    lrn: null,
    firstname: '',
    middlename: '',
    lastname: '',
    sex: '',
    birthdate: '',
    age: null,
    mothertongue: '',
    ip: '',
    religion: '',
    address: {
      houseStreet: '',
      barangay: '',
      municipality: '',
      province: ''
    },
    parents: {
      father: {
        firstname: '',
        middlename: '',
        lastname: '',
      },
      mother: {
        firstname: '',
        middlename: '',
        lastname: '',
      }
    },
    guardian: {
      name: '',
      relationship: ''
    },
    contactNumber: '',
    remarks: {
      sf1: '',
      sf2: '',
    }
  }

  const router = useRouter()
  const params = useParams()
  const id = params[1]
  const [provinces, setProvinces] = useState([])
  const [municipalities, setMunicipalities] = useState([])
  const [barangays, setBarangays] = useState([])
  const [errors, setErrors] = useState({})
  const [student, setStudent] = useState(defaultStudent)
  const [sections, setSections] = useState([])
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setSelectedGrade(grade);
    setSelectedSection("")
  }

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  }

  const fetchStudent = async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*, section_id(*)')
        .eq('id', studentId)
        .single()

      const { data: section, error: sectionError } = await supabase
        .from('section')
        .select('*')

      if (error) {
        console.error('Error fetching student:', error.message)
        return
      }

      const groupedSections = {};

      for (let i = 7; i <= 12; i++) {
        groupedSections[i] = section.filter(s => s.class_id === i);
      }

      setStudent(data)
      setSections(groupedSections)
      setSelectedGrade(data.section_id.class_id)
      setSelectedSection(data.section_id.id)

    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    const userRole = localStorage.getItem('role')

    fetch('https://psgc.gitlab.io/api/provinces/')
      .then(res => res.json())
      .then(data => setProvinces(data))


    if (id) {
      fetchStudent(id)

    }
  }, [id])

  const fetchMunicipalities = (provinceCode) => {
    setMunicipalities([])
    setBarangays([])
    fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`)
      .then(res => res.json())
      .then(data => setMunicipalities(data))
  }

  const fetchBarangays = (municipalityCode) => {
    setBarangays([])
    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${municipalityCode}/barangays/`)
      .then(res => res.json())
      .then(data => setBarangays(data))
  }


  const handleChange = (e, field, parent = null, subParent = null) => {
    let value = e.target.value;

    if (field === 'birthdate') {
      const birthDate = new Date(value);
      const juneFirst = new Date(new Date().getFullYear(), 5, 1); // June 1 of this year
      let age = juneFirst.getFullYear() - birthDate.getFullYear();

      if (birthDate > juneFirst) age--;

      setStudent(prev => ({
        ...prev,
        birthdate: value,
        age: isNaN(age) ? '' : age,
      }));
      return;
    }

    setStudent(prev => {
      if (parent && subParent) {
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [subParent]: {
              ...prev[parent][subParent],
              [field]: value,
            },
          },
        };
      } else if (parent) {
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [field]: value,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    const isValid = await validate()
    if (!isValid) return

    try {
      const { data, error } = await supabase
        .from('students')
        .update({
          lrn: student.lrn,
          firstname: student.firstname,
          middlename: student.middlename,
          lastname: student.lastname,
          sex: student.sex,
          birthdate: student.birthdate,
          age: student.age,
          mothertongue: student.mothertongue,
          ip: student.ip,
          religion: student.religion,
          address: student.address,
          parents: student.parents,
          guardian: student.guardian,
          contactNumber: student.contactNumber,
          remarks: student.remarks,
          section_id: selectedSection,
        })
        .eq('id', id); // Update the specific student by ID

      if (error) {
        console.error('Error updating student:', error.message);
        return;
      }

      alert('Student updated successfully!');
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const validate = async () => {
    const newErrors = {}
    if (!student.lrn || student.lrn.length !== 12) {
      newErrors.lrn = 'LRN must be exactly 12 digits'
    } else {

      const { data } = await supabase
        .from('students')
        .select('lrn, id')
        .eq('lrn', student.lrn)
        .neq('id', id)
        .maybeSingle()

      if (data) newErrors.lrn = 'LRN already exists'
    }
    const requiredFields = [
      'lrn', 'firstname', 'lastname', 'middlename', 'sex',
      'birthdate', 'age', 'contactNumber', 'mothertongue', 'ip', 'religion'
    ]
    const addressFields = ['province', 'municipality', 'barangay']

    requiredFields.forEach(field => {
      if (!student[field]) newErrors[field] = 'This field is required'
    })

    addressFields.forEach(field => {
      if (!student.address[field]) {
        if (!newErrors.address) newErrors.address = {}
        newErrors.address[field] = 'This field is required'
      }
    })

    const fatherComplete = student.parents.father.firstname && student.parents.father.middlename && student.parents.father.lastname

    const motherComplete = student.parents.mother.firstname && student.parents.mother.middlename && student.parents.mother.lastname

    const guardianComplete = student.guardian.name && student.guardian.relationship

    if (!fatherComplete && !motherComplete) {
      if (!guardianComplete) {
        newErrors.guardian = {
          name: 'Guardian name is required if no parent is provided',
          relationship: 'Guardian relationship is required if no parent is provided'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Fetch municipalities when province is set
  useEffect(() => {
    if (student?.address?.province) {
      const provinceCode = provinces.find(p => p.name === student.address.province)?.code;
      if (provinceCode) {
        fetchMunicipalities(provinceCode);
      }
    }
  }, [student, provinces]);

  // Fetch barangays when municipality is set
  useEffect(() => {
    if (student?.address?.municipality) {
      const municipalityCode = municipalities.find(m => m.name === student.address.municipality)?.code;
      if (municipalityCode) {
        fetchBarangays(municipalityCode);
      }
    }
  }, [student, municipalities]);

  return (
    <div className="max-w-3xl ml-[5rem] lg:mx-auto mt-16 p-6 bg-white shadow-md rounded-lg">
      <NavbarAdmin route={'officer'} routeName1={'admission'} routeName2={'student'} routeName3={'Edit'} studentId={student.id} />
      <h2 className="text-3xl font-bold mb-8 text-center text-[#820000]">Edit Student Information</h2>

      <div className="space-y-8">
        <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-[#820000] mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                LRN
                {errors.lrn && <span className="text-red-500 text-xs ml-2">{errors.lrn}</span>}
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                pattern="\d*"
                maxLength={12}
                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                value={student.lrn || ''}
                onChange={(e) => handleChange(e, 'lrn')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
                {errors.firstname && <span className="text-red-500 text-xs ml-2">{errors.firstname}</span>}
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.firstname}
                onChange={(e) => handleChange(e, 'firstname')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Middle Name
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.middlename}
                onChange={(e) => handleChange(e, 'middlename')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
                {errors.lastname && <span className="text-red-500 text-xs ml-2">{errors.lastname}</span>}
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.lastname}
                onChange={(e) => handleChange(e, 'lastname')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mother Tongue
                {errors.mothertongue && <span className="text-red-500 text-xs ml-2">{errors.mothertongue}</span>}
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.mothertongue}
                onChange={(e) => handleChange(e, 'mothertongue')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                IP (Ethnic Group)
                {errors.ip && <span className="text-red-500 text-xs ml-2">{errors.ip}</span>}
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.ip}
                onChange={(e) => handleChange(e, 'ip')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Religion
                {errors.religion && <span className="text-red-500 text-xs ml-2">{errors.religion}</span>}
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.religion}
                onChange={(e) => handleChange(e, 'religion')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sex
                {errors.sex && <span className="text-red-500 text-xs ml-2">{errors.sex}</span>}
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sex"
                    value="M"
                    checked={student.sex === "M"}
                    onChange={(e) => handleChange(e, 'sex')}
                    className="h-4 w-4 text-[#820000] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sex"
                    value="F"
                    checked={student.sex === "F"}
                    onChange={(e) => handleChange(e, 'sex')}
                    className="h-4 w-4 text-[#820000] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Female</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Birthdate
                {errors.birthdate && <span className="text-red-500 text-xs ml-2">{errors.birthdate}</span>}
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="date"
                value={student.birthdate}
                onChange={(e) => handleChange(e, 'birthdate')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                pattern="\d*"
                value={student.age || ''}
                readOnly
                disabled
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-[#820000] mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Province
                {errors.address?.province && <span className="text-red-500 text-xs ml-2">{errors.address.province}</span>}
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={provinces.find(p => p.name === student?.address?.province)?.code || ''}
                onChange={(e) => {
                  const selectedProvince = provinces.find(p => p.code === e.target.value);
                  fetchMunicipalities(e.target.value);
                  handleChange({ target: { value: selectedProvince?.name || '' } }, 'province', 'address');
                }}
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province.code} value={province.code}>{province.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Municipality / City
                {errors.address?.municipality && <span className="text-red-500 text-xs ml-2">{errors.address.municipality}</span>}
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={municipalities.find(m => m.name === student?.address?.municipality)?.code || ''}
                onChange={(e) => {
                  const selectedMunicipality = municipalities.find(m => m.code === e.target.value);
                  fetchBarangays(e.target.value);
                  handleChange({ target: { value: selectedMunicipality?.name || '' } }, 'municipality', 'address');
                }}
              >
                <option value="">Select Municipality</option>
                {municipalities.map(municipality => (
                  <option key={municipality.code} value={municipality.code}>{municipality.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Barangay
                {errors.address?.barangay && <span className="text-red-500 text-xs ml-2">{errors.address.barangay}</span>}
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={barangays.find(b => b.name === student?.address?.barangay)?.code || ''}
                onChange={(e) => {
                  const selectedBarangay = barangays.find(b => b.code === e.target.value);
                  handleChange({ target: { value: selectedBarangay?.name || '' } }, 'barangay', 'address');
                }}
              >
                <option value="">Select Barangay</option>
                {barangays.map(barangay => (
                  <option key={barangay.code} value={barangay.code}>{barangay.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                House # / Street / Sitio / Purok
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.address.houseStreet}
                onChange={(e) => handleChange(e, 'houseStreet', 'address')}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-[#820000] mb-4">Parents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-medium text-[#820000]">Father</h4>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.parents.father.firstname}
                onChange={(e) => handleChange(e, 'firstname', 'parents', 'father')}
              />
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Middle Name
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.parents.father.middlename}
                onChange={(e) => handleChange(e, 'middlename', 'parents', 'father')}
              />
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Last Name
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.parents.father.lastname}
                onChange={(e) => handleChange(e, 'lastname', 'parents', 'father')}
              />
            </div>
            <div>
              <h4 className="text-lg font-medium text-[#820000]">Mother</h4>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.parents.mother.firstname}
                onChange={(e) => handleChange(e, 'firstname', 'parents', 'mother')}
              />
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Middle Name
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.parents.mother.middlename}
                onChange={(e) => handleChange(e, 'middlename', 'parents', 'mother')}
              />
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Last Name
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.parents.mother.lastname}
                onChange={(e) => handleChange(e, 'lastname', 'parents', 'mother')}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-[#820000] mb-4">Guardian <i>(if no parent)</i></h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
                {errors.guardian?.name && <span className="text-red-500 text-xs ml-2">{errors.guardian.name}</span>}
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.guardian.name}
                onChange={(e) => handleChange(e, 'name', 'guardian')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Relationship
                {errors.guardian?.relationship && <span className="text-red-500 text-xs ml-2">{errors.guardian.relationship}</span>}
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                value={student.guardian.relationship}
                onChange={(e) => handleChange(e, 'relationship', 'guardian')}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-[#820000] mb-4">Contact & Remarks</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
                {errors.contactNumber && <span className="text-red-500 text-xs ml-2">{errors.contactNumber}</span>}
              </label>
              <input
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                type="text"
                pattern="\d*"
                maxLength={12}
                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                value={student.contactNumber}
                onChange={(e) => handleChange(e, 'contactNumber')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={student.remarks.sf1}
                onChange={(e) => handleChange(e, 'sf1', 'remarks')}
              >
                <option value="">Select Remarks</option>
                <option value="T/O">T/O - Transferred Out | Name of  Public (P) Private (PR) School  & Effectivity Date</option>
                <option value="T/I">T/I - Transferred In | Name of  Public (P) Private (PR) School  & Effectivity Date</option>
                <option value="DRP">DRP - Dropped | Reason and Effectivity Date</option>
                <option value="LE">LE - Late Enrollment | Reason (Enrollment beyond 1st Friday of June)</option>
                <option value="CCT">CCT - CCT Control/reference number</option>
                <option value="B/A">B/A - Name of school last attended & Year</option>
                <option value="LWD">LWD - Specify</option>
                <option value="ACL">ACL - Specify Level & Effectivity Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-sm mt-8">
        <h3 className="text-xl font-semibold text-[#820000] mb-4">Grade and Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grade
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={selectedGrade}
              onChange={handleGradeChange}
            >
              <option value="">Select Grade</option>
              {Object.keys(sections).map((key) => (
                <option key={key} value={key}>
                  Grade {key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Section
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={selectedSection}
              onChange={handleSectionChange}
              disabled={!selectedGrade}
            >
              <option value="">Select Section</option>
              {selectedGrade &&
                sections[selectedGrade]?.map((section) => (
                  <option key={section.section_name} value={section.id}>
                    {section.section_name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 mt-8">
        <button className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors" onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
}

export default editStudent
