"use client";
import React, { useState, useEffect } from "react";
import supabase from "../../../../../lib/supabaseClient";
import NavbarAdmin from "../../../../../../Components/NavbarAdmin";
import { useRouter, useParams } from "next/navigation";
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai"

const EditTeacher = () => {
  const router = useRouter();
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);

  // Fetch teacher data
  const fetchTeacher = async (teacherId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", teacherId)
        .single();

      if (error) {
        console.error("Error fetching teacher:", error.message);
        return;
      }

      // Fetch current section info if the teacher is already an adviser
      const { data: sectionData, error: sectionError } = await supabase
        .from("section")
        .select("*")
        .eq("adviser", data.school_id)
        .single();

      if (sectionError || !sectionData) {
        setTeacher({
          ...data,
          old_class_id: null,
          old_section_name: null,
        });
        return;
      }

      setTeacher({
        ...data,
        old_class_id: sectionData?.class_id || null,
        old_section_name: sectionData?.section_name || null,
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Fetch sections for grade/section dropdowns
  const fetchSections = async () => {
    const { data, error } = await supabase.from("section").select("*");
    if (error) {
      console.error("Error fetching sections:", error.message);
    } else {
      setSections(data);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTeacher(id);
      fetchSections();
    }
  }, [id]);

  // Update filtered sections when grade level changes
  useEffect(() => {
    if (teacher?.class_id) {
      setFilteredSections(
        sections.filter((s) => s.class_id == teacher.class_id)
      );
    } else {
      setFilteredSections([]);
    }
  }, [teacher?.class_id, sections]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length <= 12) {
      setTeacher((prev) => ({
        ...prev,
        phone_number: value,
      }));
    }
  };

  const updateTeacher = async () => {
    setLoading(true);
    setErrors({});

    const {
      first_name,
      middle_name,
      last_name,
      email,
      phone_number,
      school_id,
    } = teacher;

    // Validation
    if (!first_name || !last_name || !email || !phone_number || !school_id) {
      setErrors({ general: "All required fields must be filled." });
      setLoading(false);
      return;
    }

    // Update teacher in the users table
    const { error } = await supabase
      .from("users")
      .update({
        first_name,
        middle_name,
        last_name,
        email,
        phone_number,
        school_id,
      })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error.message);
      setErrors({ general: "Failed to update teacher." });
      setLoading(false);
      return;
    }

    // Step 1: Update adviser in the new section (Grade 8 Revelation)
    if (teacher.class_id && teacher.section_name) {
      const { error: sectionError } = await supabase
        .from("section")
        .update({ adviser: school_id })
        .match({ class_id: teacher.class_id, section_name: teacher.section_name });

      if (sectionError) {
        console.error("Failed to update section adviser:", sectionError.message);
        setErrors({ general: "Failed to update adviser in section table." });
        setLoading(false);
        return;
      }
    }

    // Step 2: Remove the teacher as adviser from the old section (Grade 7 Mercury)
    if (teacher.old_class_id && teacher.old_section_name) {
      const { error: removeAdviserError } = await supabase
        .from("section")
        .update({ adviser: null }) // Nullify adviser
        .match({ class_id: teacher.old_class_id, section_name: teacher.old_section_name });

      if (removeAdviserError) {
        console.error("Failed to remove adviser from old section:", removeAdviserError.message);
        setErrors({ general: "Failed to remove adviser from old section." });
        setLoading(false);
        return;
      }
    }

    alert("Teacher updated successfully.");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg">
      <NavbarAdmin
        route="admin"
        routeName1="teachers"
        routeName2="view"
        routeName3="edit"
        teacherId={id}
      />



      {teacher ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <fieldset className="space-y-4">
            <h2 className="text-3xl font-bold text-[#820000] mb-6 text-center">
              Edit Teacher
            </h2>
            {[{ label: "First Name", name: "first_name" }, { label: "Middle Name", name: "middle_name" }, { label: "Last Name", name: "last_name" }, { label: "Email", name: "email", type: "email" }, { label: "School ID", name: "school_id" }].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-gray-600 font-medium">{label}</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#820000] focus:outline-none"
                  type={type}
                  name={name}
                  value={teacher[name] || ""}
                  onChange={handleInputChange}
                />
                {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
              </div>
            ))}

            {/* Phone Number */}
            <div>
              <label className="block text-gray-600 font-medium">Phone Number</label>
              <input
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#820000] focus:outline-none"
                type="text"
                maxLength={12}
                name="phone_number"
                value={teacher.phone_number || ""}
                onChange={handlePhoneNumberChange}
              />
              {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
            </div>

            {/* Grade Level Dropdown */}
            <div>
              <label className="block text-gray-600 font-medium">Grade Level</label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#820000] focus:outline-none"
                name="class_id"
                value={teacher.class_id || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Grade Level</option>
                {[7, 8, 9, 10, 11, 12].map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Dropdown */}
            <div>
              <label className="block text-gray-600 font-medium">Section</label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#820000] focus:outline-none"
                name="section_name"
                value={teacher.section_name || ""}
                onChange={handleInputChange}
                disabled={!teacher.class_id}
              >
                <option value="">Select Section</option>
                {filteredSections.map((section) => (
                  <option key={section.id} value={section.section_name}>
                    {section.section_name}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={updateTeacher}
              className="px-6 py-2 bg-[#820000] text-white rounded shadow hover:bg-red-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general}</p>}
        </div>
      ) : (
        <div className='fixed top-0 left-0 bottom-0 right-0 bg-black/70 z-40'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <Loader className='loading-circle text-6xl text-[#d62b2b] z-50' />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTeacher;
