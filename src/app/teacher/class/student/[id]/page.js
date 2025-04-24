"use client";
import React, { useState, useEffect } from "react";
import supabase from "../../../../lib/supabaseClient";
import NavbarAdmin from "../../../../../Components/NavbarAdmin";
import GradesModal from "../../../../../Components/GradesModal";
import { useRouter, useParams } from "next/navigation";
import { IoPersonCircleSharp as DefaultPic } from "react-icons/io5"

const ViewStudent = () => {
  const router = useRouter();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState()
  const [jhsflag, setjhsflag] = useState(true)
  const [semester, setSemester] = useState(1)
  const [gradesModal, setGradesModal] = useState(false)

  const fetchStudent = async (studentId) => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*, section_id(*)")
        .eq("id", studentId)
        .single();

      if (error) {
        console.error("Error fetching student:", error.message);
        return;
      }

      setStudent(data)
      fetchSubjects(data.section_id, data.lrn)
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };



  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const userRole = localStorage.getItem("role");

    if (userId && userRole) {
      if (userRole === "admin") router.push("/admin");
    } else {
      router.push("/");
    }

    if (id) {
      fetchStudent(id)
    }
  }, [id]);

  useEffect(() => {
    if (!student?.section_id || !student?.lrn) return;

    const channel = supabase.channel('realtime-grades');

    // JHS (Junior High School)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'jr_student_grades',
        filter: `LRN=eq.${student.lrn}`
      },
      (payload) => {
        fetchSubjects(student.section_id, student.lrn);
      }
    );

    // SHS (Senior High School)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sr_student_grades',
        filter: `LRN=eq.${student.lrn}`
      },
      (payload) => {
        fetchSubjects(student.section_id, student.lrn);
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [student?.section_id, student?.lrn]);

  const fetchSubjects = async (section, lrn) => {
    try {
      if (section.class_id < 11) {
        const { data: jhs, error: jhserror } = await supabase
          .from("jr_subject")
          .select("*");

        const { data: grades, error: gradeerror } = await supabase
          .from("jr_student_grades")
          .select("*, subject_id(*)")
          .eq("LRN", lrn)
          .eq("class_id", section.id)

        if (jhserror) {
          console.error("Error fetching JHS subjects:", jhserror.message);
          return;
        }

        const groupedSubjects = [0, 1, 2, 3].map(() =>
          jhs.map(subject => ({
            ...subject,
            grade_mark: 'Not Yet Available'
          }))
        );

        if (grades) {
          grades.forEach(grade => {
            const quarterIndex = grade.quarter - 1;

            const subjectIndex = groupedSubjects[quarterIndex].findIndex(
              subj => subj.id === grade.subject_id.id // matching subject
            );

            if (subjectIndex !== -1) {
              groupedSubjects[quarterIndex][subjectIndex].grade_mark = grade.grade_mark === null ? 'Not Yet Available' : grade.grade_mark
            }
          })
        }

        setSubjects(groupedSubjects)
        setjhsflag(true)
      } else {
        const { data: shs, error: shserror } = await supabase
          .from("sr_subject")
          .select("*")
          .eq('class_id', section.class_id)
          .eq('strand', section.section_name);

        const { data: grades, error: gradeerror } = await supabase
          .from("sr_student_grades")
          .select("*, subject_id(*)")
          .eq("LRN", lrn);

        if (shserror) {
          console.error("Error fetching SHS subjects:", shserror.message);
          return;
        }

        const groupedSubjects = [[], [], [], []];

        shs.forEach(subject => {
          if (subject.semester === 1) {
            groupedSubjects[0].push({ ...subject, grade_mark: 'Not Yet Available' });
            groupedSubjects[1].push({ ...subject, grade_mark: 'Not Yet Available' });
          } else if (subject.semester === 2) {
            groupedSubjects[2].push({ ...subject, grade_mark: 'Not Yet Available' });
            groupedSubjects[3].push({ ...subject, grade_mark: 'Not Yet Available' });
          }
        });

        if (grades) {
          grades.forEach(grade => {
            const quarterIndex = grade.quarter - 1;
            const subjectIndex = groupedSubjects[quarterIndex].findIndex(
              subj => subj.id === grade.subject_id.id
            );

            if (subjectIndex !== -1) {
              groupedSubjects[quarterIndex][subjectIndex].grade_mark =
                grade.grade_mark === null ? 'Not Yet Available' : grade.grade_mark
            }
          });
        }

        setSubjects(groupedSubjects)
        setjhsflag(false)
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const getOrdinalSuffix = (number) => {
    const j = number % 10;
    const k = number % 100;
    if (j === 1 && k !== 11) {
      return `${number}st`;
    }
    if (j === 2 && k !== 12) {
      return `${number}nd`;
    }
    if (j === 3 && k !== 13) {
      return `${number}rd`;
    }
    return `${number}th`;
  };

  return (
    <div className="w-full px-4 py-10 lg:px-10 bg-gray-100 min-h-screen pt-[5rem]">
      <NavbarAdmin route="teacher" routeName1="class" routeName2="Student" />

      <h2 className="text-3xl font-bold text-[#820000] mb-10 text-center">
        Student Information
      </h2>

      {student ? (
        <div className="flex flex-col lg:flex-row gap-6 pl-[4rem]">

          {/* Left Side: Student Info */}
          <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex flex-col items-center">
              {student.profile_picture ? (
                <img
                  src={`${student.profile_picture}?t=${new Date().getTime()}`}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-[#820000] mb-4"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-200 mb-4">
                  <DefaultPic className="text-[6rem] text-gray-700" />
                </div>
              )}

              <p className="text-xl font-bold text-[#820000]">
                {student.firstname} {student.lastname}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200 shadow-sm">
                <span className="text-black font-medium">Age</span>
                <span className="text-gray-700">{student.age}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200 shadow-sm">
                <span className="text-black font-medium">Sex</span>
                <span className="text-gray-700">{student.sex === 'M' ? 'Male' : 'Female'}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200 shadow-sm">
                <span className="text-black font-medium">Address</span>
                <span className="text-gray-700 text-right">
                  {student.address?.barangay},<br />
                  {student.address?.municipality}, {student.address?.province}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200 shadow-sm">
                <span className="text-black font-medium">Grade & Section</span>
                <span className="text-gray-700">
                  Grade {student?.section_id.class_id} {student?.section_id.section_name}
                </span>
              </div>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => { router.push(`edit/${id}`) }}
                className="px-6 py-2 bg-[#820000] text-white font-semibold rounded hover:bg-[#660000] transition"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Right Side: Grades */}
          <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {[1, 2, 3, 4].map(q => (
                <button
                  key={q}
                  onClick={() => setSemester(q)}
                  className={`px-4 py-2 rounded font-semibold transition ${semester === q
                    ? 'bg-[#820000] text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  {getOrdinalSuffix(q)} Quarter
                </button>
              ))}
            </div>

            <div>
              <p className="text-xl font-bold text-[#820000] text-center mb-2">
                {getOrdinalSuffix(semester)} Quarter
              </p>

              <div className="mt-4 space-y-2">
                {subjects?.[semester - 1]?.map?.(subject => (
                  <div
                    key={subject.id}
                    className="flex justify-between bg-gray-50 p-3 rounded border border-gray-200 shadow-sm"
                  >
                    <span className="font-medium text-black">{subject.subject}</span>
                    <span className="text-gray-700">{subject.grade_mark}</span>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => setGradesModal(true)}
                  className="px-5 py-2 bg-[#820000] text-white rounded hover:bg-[#660000] transition"
                >
                  Edit Grades
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading student data...</p>
      )}

      {gradesModal && (
        <GradesModal
          onClose={() => setGradesModal(false)}
          subjects={subjects?.[semester - 1]}
          semester={semester}
          student={student}
        />
      )}
    </div>
  );
};

export default ViewStudent