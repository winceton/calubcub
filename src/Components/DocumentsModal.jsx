import React, { useEffect, useState } from 'react'
import supabase from '../app/lib/supabaseClient'

const DocumentViewerModal = ({ doc, onClose }) => {
  return (
    <div
      className='fixed top-0 left-0 right-0 bottom-0 bg-black/80 z-50 flex items-center justify-center px-2'
      onClick={onClose}
    >
      <div
        className='bg-white p-4 rounded w-full max-w-4xl max-h-[90vh] overflow-auto relative'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-2 right-2 text-xl cursor-pointer'
          onClick={onClose}
        >
          ✖
        </button>

        <p className='text-center font-semibold mb-4'>{doc.label}</p>

        {doc.url.endsWith('.pdf') ? (
          <iframe
            src={doc.url}
            title={doc.name}
            className='w-full'
            style={{ height: '80vh' }}
          />
        ) : (
          <img
            src={doc.url}
            alt={doc.name}
            className='mx-auto object-contain'
            style={{ maxHeight: '80vh' }}
          />
        )}
      </div>
    </div>
  )
}

const DocumentsModal = ({ onClose, studentid }) => {
  const [student, setStudent] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)

  const fetchStudent = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentid)
      .single()

    if (error) console.error(error)
    else setStudent(data)
  }

  const fetchDocuments = async () => {
    const { data, error } = await supabase.storage
      .from('filerequirements')
      .list(`${studentid}/`)

    if (error) {
      console.error('Error fetching files:', error.message)
      return
    }

    const filesWithUrls = await Promise.all(
      data.map(async (file) => {
        const { data: urlData } = await supabase.storage
          .from('filerequirements')
          .getPublicUrl(`${studentid}/${file.name}`)
        return { name: file.name, url: urlData.publicUrl }
      })
    )

    setDocuments(filesWithUrls)
  }

  const handleUpload = async () => {
    if (!file || !selectedType) return
    setUploading(true)

    const folderPath = `${studentid}/`
    const fileExtension = file.name.split('.').pop()
    const fileName = `${selectedType}.${fileExtension}`
    const filePath = `${folderPath}${fileName}`

    const { data: list, error: listError } = await supabase.storage
      .from('filerequirements')
      .list(folderPath)

    if (!listError) {
      const filesToDelete = list
        .filter(item => item.name.startsWith(selectedType))
        .map(item => `${folderPath}${item.name}`)

      if (filesToDelete.length > 0) {
        await supabase.storage.from('filerequirements').remove(filesToDelete)
      }
    }

    const { error: uploadError } = await supabase.storage
      .from('filerequirements')
      .upload(filePath, file)

    setUploading(false)

    if (uploadError) {
      console.error('Upload failed:', uploadError.message)
      return
    }

    setFile(null)
    setSelectedType('')
    await fetchDocuments()
    alert('Upload successful!')
  }

  const handleDelete = async (filename) => {
    const confirm = window.confirm('Are you sure you want to delete this file?')
    if (!confirm) return

    const { error } = await supabase.storage
      .from('filerequirements')
      .remove([`${studentid}/${filename}`])

    if (error) {
      console.error('Delete failed:', error.message)
      return
    }

    await fetchDocuments()
    alert('File deleted successfully!')
  }

  useEffect(() => {
    fetchStudent()
    fetchDocuments()
  }, [])

  return (
    <div
      className='fixed top-0 left-0 right-0 bottom-0 bg-black/70 flex justify-center items-center z-40'
      onClick={onClose}
    >
      <div
        className='bg-white md:p-5 rounded-lg w-[100%] h-auto p-3 md:w-[90%] max-w-[1500px] md:h-[80vh] max-h-[90vh] text-center relative flex flex-col overflow-y-auto sm:w-[95%] sm:h-[70vh]'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-[10px] right-[10px] cursor-pointer text-base md:text-2xl border-none bg-none sm:text-lg'
          onClick={onClose}
        >
          ✖
        </button>

        <p className='text-lg font-semibold mb-4'>
          Upload Document for {student?.firstname} {student?.lastname}
        </p>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className='mb-4 border p-2 rounded'
        >
          <option value="">Select Document Type</option>
          <option value="birth_certificate">Birth Certificate</option>
          <option value="form_137">Form 137</option>
          <option value="elementary_card">Elementary Card</option>
        </select>

        <input
          type='file'
          accept='image/*,.pdf'
          onChange={(e) => setFile(e.target.files[0])}
          className='mb-4 border p-2 rounded'
        />

        <button
          onClick={handleUpload}
          disabled={uploading || !file || !selectedType}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4'
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {documents.map((doc, index) => {
            const label = doc.name.startsWith('birth_certificate')
              ? 'Birth Certificate'
              : doc.name.startsWith('form_137')
              ? 'Form 137'
              : doc.name.startsWith('elementary_card')
              ? 'Elementary Card'
              : doc.name

            return (
              <div key={index} className='border p-3 rounded shadow'>
                <p className='font-medium mb-2'>{label}</p>
                <div className='flex gap-2 justify-center'>
                  <button
                    onClick={() => setSelectedDoc({ ...doc, label })}
                    className='px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm'
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(doc.name)}
                    className='px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm'
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {selectedDoc && (
          <DocumentViewerModal
            doc={selectedDoc}
            onClose={() => setSelectedDoc(null)}
          />
        )}
      </div>
    </div>
  )
}

export default DocumentsModal
