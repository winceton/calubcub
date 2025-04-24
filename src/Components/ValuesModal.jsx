import React, { useState, useEffect } from 'react';
import supabase from '../app/lib/supabaseClient';

const ValuesModal = ({ onClose, semester, student }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const label = ['1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter'][semester - 1] || '';

  const [coreValues, setCoreValues] = useState({
    'Maka-Diyos': { 1: 'N/A', 2: 'N/A' }, 
    'Makatao': { 1: 'N/A', 2: 'N/A' },  
    'Makakalikasan': { 1: 'N/A', 2: '' },   
    'Makabansa': { 1: 'N/A', 2: 'N/A' }, 
  });

  useEffect(() => {
    const fetchValues = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('values')
        .select('*')
        .eq('LRN', student.lrn)
        .eq('class_id', student.section_id.id)
        .eq('quarter', semester);

      if (error) {
        console.error('Fetch error:', error);
        setErrorMessage('Failed to load core values.');
      } else {
        const updated = { ...coreValues };
        data.forEach(val => {
          if (val.core_values in updated) {
            updated[val.core_values] = val.marking;
          }
        });
        setCoreValues(updated);
      }

      setLoading(false);
    };

    fetchValues();
  }, [student, semester]);

  const handleUpdate = async () => {
    setLoading(true);
    setErrorMessage(null);

    // Prepare entries to be inserted/updated
    const entries = Object.entries(coreValues).map(([coreValue, markings]) => ({
      LRN: student.lrn,
      class_id: student.section_id.id,
      quarter: semester,
      core_values: coreValue,
      marking: markings, // Save the updated object as JSONB
    }));

    const { error } = await supabase.from('values').upsert(entries, {
      onConflict: ['LRN', 'class_id', 'quarter', 'core_values'],
    });

    if (error) {
      setErrorMessage('Failed to save core values.');
    } else {
      onClose();
    }

    setLoading(false);
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
          {student.firstname} {student.lastname}'s Core Values — {label}
        </h2>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        {/* 3 Column Grid Layout */}
        <div className="grid grid-cols-3 gap-4">
          {/* Row 1: Maka-Diyos */}
          <div className="font-semibold text-gray-700 text-3xl">Maka-Diyos</div>
          <div className="text-sm text-gray-500">Expresses one’s spiritual beliefs while respecting the spiritual beliefs of others</div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={coreValues["Maka-Diyos"][1]}
              onChange={(e) =>
                setCoreValues((prev) => ({
                  ...prev,
                  "Maka-Diyos": { ...prev["Maka-Diyos"], 1: e.target.value },
                }))
              }
            >
              <option value="N/A">N/A</option>
              <option value="AO">Always Observed</option>
              <option value="SO">Sometimes Observed</option>
              <option value="RO">Rarely Observed</option>
              <option value="NO">Not Observed</option>
            </select>
          </div>

          {/* Row 2: Maka-Diyos */}
          <div className="font-semibold text-gray-700"></div>
          <div className="text-sm text-gray-500">Shows adherence to ethical principles by upholding truth in all undertakings</div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={coreValues["Maka-Diyos"][2]}
              onChange={(e) =>
                setCoreValues((prev) => ({
                  ...prev,
                  "Maka-Diyos": { ...prev["Maka-Diyos"], 2: e.target.value },
                }))
              }
            >
              <option value="N/A">N/A</option>
              <option value="AO">Always Observed</option>
              <option value="SO">Sometimes Observed</option>
              <option value="RO">Rarely Observed</option>
              <option value="NO">Not Observed</option>
            </select>
          </div>

          {/* Row 3: Makatao */}
          <div className="font-semibold text-gray-700 text-3xl">Makatao</div>
          <div className="text-sm text-gray-500">Is sensitive to individual, social, and cultural differences; resists stereotyping people</div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={coreValues["Makatao"][1]}
              onChange={(e) =>
                setCoreValues((prev) => ({
                  ...prev,
                  Makatao: { ...prev["Makatao"], 1: e.target.value },
                }))
              }
            >
              <option value="N/A">N/A</option>
              <option value="AO">Always Observed</option>
              <option value="SO">Sometimes Observed</option>
              <option value="RO">Rarely Observed</option>
              <option value="NO">Not Observed</option>
            </select>
          </div>

          {/* Row 4: Makatao */}
          <div className="font-semibold text-gray-700"></div>
          <div className="text-sm text-gray-500">Demonstrates contributions toward solidarity</div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={coreValues["Makatao"][2]}
              onChange={(e) =>
                setCoreValues((prev) => ({
                  ...prev,
                  Makatao: { ...prev["Makatao"], 2: e.target.value },
                }))
              }
            >
              <option value="N/A">N/A</option>
              <option value="AO">Always Observed</option>
              <option value="SO">Sometimes Observed</option>
              <option value="RO">Rarely Observed</option>
              <option value="NO">Not Observed</option>
            </select>
          </div>

          {/* Row 5: Makakalikasan */}
          <div className="font-semibold text-gray-700 text-3xl">Makakalikasan</div>
          <div className="text-sm text-gray-500">Cares for the environment and utilizes resources wisely, judiciously, and economically</div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={coreValues["Makakalikasan"][1]}
              onChange={(e) =>
                setCoreValues((prev) => ({
                  ...prev,
                  Makakalikasan: { ...prev["Makakalikasan"], 1: e.target.value },
                }))
              }
            >
              <option value="N/A">N/A</option>
              <option value="AO">Always Observed</option>
              <option value="SO">Sometimes Observed</option>
              <option value="RO">Rarely Observed</option>
              <option value="NO">Not Observed</option>
            </select>
          </div>

          {/* Row 6: Makakalikasan */}
          <div className="font-semibold text-gray-700"></div>
          <div className="text-sm text-gray-500"></div>
          <div>
            
          </div>

          {/* Row 7: Makabansa */}
          <div className="font-semibold text-gray-700 text-3xl">Makabansa</div>
          <div className="text-sm text-gray-500">Demonstrates pride in being a Filipino; exercises the rights and responsibilities of a Filipino citizen</div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={coreValues["Makabansa"][1]}
              onChange={(e) =>
                setCoreValues((prev) => ({
                  ...prev,
                  Makabansa: { ...prev["Makabansa"], 1: e.target.value },
                }))
              }
            >
              <option value="N/A">N/A</option>
              <option value="AO">Always Observed</option>
              <option value="SO">Sometimes Observed</option>
              <option value="RO">Rarely Observed</option>
              <option value="NO">Not Observed</option>
            </select>
          </div>

          {/* Row 8: Makabansa */}
          <div className="font-semibold text-gray-700"></div>
          <div className="text-sm text-gray-500">Demonstrates appropriate behavior in carrying out activities in the school, community, and country</div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={coreValues["Makabansa"][2]}
              onChange={(e) =>
                setCoreValues((prev) => ({
                  ...prev,
                  Makabansa: { ...prev["Makabansa"], 2: e.target.value },
                }))
              }
            >
              <option value="N/A">N/A</option>
              <option value="AO">Always Observed</option>
              <option value="SO">Sometimes Observed</option>
              <option value="RO">Rarely Observed</option>
              <option value="NO">Not Observed</option>
            </select>
          </div>
        </div>

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

export default ValuesModal;
