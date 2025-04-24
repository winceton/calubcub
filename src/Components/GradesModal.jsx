import React, { useState } from 'react';
import supabase from '../app/lib/supabaseClient';

const GradesModal = ({ onClose, subjects, semester, student }) => {

  const label = ['1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter'][semester - 1] || '';

  // Set up local state for grades to capture changes
  const [updatedSubjects, setUpdatedSubjects] = useState(subjects);
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // Handle changes in the input fields
  const handleGradeChange = (id, newGrade) => {
    const clean = newGrade === '' ? null : Number(newGrade);  // ← convert here
    setUpdatedSubjects(prev =>
      prev.map(subject =>
        subject.id === id ? { ...subject, grade_mark: clean } : subject
      )
    );
  };


  const handleUpdate = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      let updatedGrades

      if (student.section_id.class_id <= 10) {

        updatedGrades = updatedSubjects.map(subject => ({
          subject_id: subject.id,
          grade_mark: subject.grade_mark,
          LRN: student.lrn,
          quarter: semester,
          class_id: student.section_id.id,
        }));

        const { data, error } = await supabase
          .from('jr_student_grades')
          .upsert(updatedGrades, {
            onConflict: ['subject_id', 'LRN', 'quarter', 'class_id'],
          });

        if (error) {
          throw new Error(error.message)
        }

      } else {

        updatedGrades = updatedSubjects.map(subject => ({
          subject_id: subject.id,
          grade_mark: subject.grade_mark,
          quarter: semester,
          LRN: student.lrn,
        }));

        const { data, error } = await supabase
          .from('sr_student_grades')
          .upsert(updatedGrades, {
            onConflict: ['subject_id', 'LRN', 'quarter'],
          });

        if (error) {
          throw new Error(error.message)
        }
      }

      onClose()

    } catch (err) {
      setErrorMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl h-auto md:h-[80vh] max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-[#820000] hover:text-red-700 text-2xl transition duration-200"
          onClick={onClose}
          aria-label="Close"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-[#820000] mb-2 text-center">
          {student.firstname} {student.lastname}'s Grades — {label}
        </h2>

        <div className="flex flex-col gap-4">
          {updatedSubjects.map((subject) => (
            <div
              key={subject.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-3"
            >
              <p className="text-gray-800 text-base font-medium w-full sm:w-1/2">{subject.subject}</p>
              <select
                value={subject.grade_mark ?? ''}
                onChange={(e) => handleGradeChange(subject.id, e.target.value)}
                className="w-full sm:w-1/4 border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-[#820000] outline-none"
              >
                <option value="">Not Yet Available</option>
                {Array.from({ length: 41 }, (_, i) => 60 + i).map((score) => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <div className="mt-auto pt-4 text-right">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-medium transition duration-200 ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#820000] hover:bg-red-800'
              }`}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradesModal;
