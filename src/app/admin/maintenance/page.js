'use client'
import React, { useEffect, useState } from 'react'
import NavbarAdmin from '../../../Components/NavbarAdmin'
import supabase from '../../../app/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai";




const page = () => {
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [userID, setUserID] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    summary: '',
    type: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  async function getAboutUsImages() {
    const bucket = supabase.storage.from('aboutus');

    async function entriesFor(prefix) {
      const { data: list, error } = await bucket.list(`${prefix}/`, { limit: 100 });
      if (error) {
        console.error(`List error for ${prefix}:`, error);
        return [];
      }
      return list.map((obj) => {
        const { data: { publicUrl } } = bucket.getPublicUrl(`${prefix}/${obj.name}`);
        return { name: obj.name, url: publicUrl };
      });
    }

    const [fac, lab, room] = await Promise.all([
      entriesFor('Facilities'),
      entriesFor('Laboratory'),
      entriesFor('Rooms'),
    ]);

    return { Facilities: fac, Laboratory: lab, Rooms: room };
  }

  useEffect(() => {
    if (selectedArticle) {
      setFormData({
        title: selectedArticle.title || '',
        date: selectedArticle.date || '',
        summary: selectedArticle.summary || '',
        type: selectedArticle.type || '',
        image: selectedArticle.image || '',
      });
    } else {
      setFormData({
        title: '',
        date: '',
        summary: '',
        type: '',
        image: '',
      })
      setImagePreview(null)
      setImageFile(null)
    }
  }, [selectedArticle])

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    setUserID(userId)

    const fetchNews = async () => {
      const { data: news, error } = await supabase
        .from('news')
        .select('id, author(first_name, last_name), title, date, image, summary, type')
        .eq('isDeleted', false)

      if (error) {
        console.error('Error fetching news:', error)
      } else {
        setArticles(news)
      }
    }

    fetchNews()

    const channel = supabase
      .channel('realtime_news')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        () => fetchNews()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSave = async () => {
    let imageUrl = formData.image

    if (imageFile) {
      if (formData.image) {
        const oldImagePath = formData.image.split('/').pop()
        await supabase.storage.from('news').remove([oldImagePath])
      }

      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage
        .from('news')
        .upload(fileName, imageFile)

      if (uploadError) {
        alert('Image upload failed!')
        return
      }

      const { data: publicUrl } = supabase.storage
        .from('news')
        .getPublicUrl(fileName)

      imageUrl = publicUrl.publicUrl
    }

    if (!selectedArticle.id) {
      const { error } = await supabase.from('news').insert({
        title: formData.title,
        date: formData.date,
        summary: formData.summary,
        type: formData.type,
        isDeleted: false,
        author: userID,
        image: imageUrl
      })

      if (error) {
        alert('Insert failed!')
      } else {
        alert('News added successfully!')
        setSelectedArticle(null)
      }
    } else {
      const { error } = await supabase.from('news').update({
        title: formData.title,
        date: formData.date,
        summary: formData.summary,
        type: formData.type,
        image: imageUrl
      }).eq('id', selectedArticle.id)

      if (error) {
        alert('Update failed!')
      } else {
        alert('News updated successfully!')
        setSelectedArticle(null)
      }
    }
  }


  const softDelete = async (id) => {
    const { data, error } = await supabase
      .from('news')
      .update({ isDeleted: true })
      .eq('id', id)

    setDeleteModal(false)
  }

  // sorting articles
  const sortedArticles = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));



  const [facilitiesTab, setFacilitiesTab] = useState(true); // true = Facilities tab, false = News tab
  const [aboutUsImages, setAboutUsImages] = useState([]);
  const [category, setCategory] = useState('Facilities');
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile1, setImageFile1] = useState(null);
  const [imagePreview1, setImagePreview1] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newandevents, setnewsandevents] = useState(false);
  const [name, setname] = useState('Name')
  const [editModal, setEditModal] = useState(null);
  const [newFile, setNewFile] = useState(null);  // holds the replacement image
  const [newName, setNewName] = useState('');    // holds the new filename (no extension)


  const [imagesByCat, setImagesByCat] = useState({
    Facilities: [],
    Laboratory: [],
    Rooms: [],
  });

  useEffect(() => {
    (async () => {
      const grouped = await getAboutUsImages();
      setImagesByCat(grouped);
    })();
  }, [uploading]);


  async function handleFileUpload() {
    if (!imageFile1) return alert('Choose an image first');

    try {
      setUploading(true);
      const filePath = `${category}/${Date.now()}-${name}`;

      const { error } = await supabase.storage
        .from('aboutus')
        .upload(filePath, imageFile1, { upsert: false });

      if (error) throw error;

      alert('Uploaded successfully!');
      setModalOpen(false);
      setImageFile1(null);
      setImagePreview1('');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  }
  function prettify(name) {
    // 1) keep everything after the first dash
    const withoutPrefix = name.includes('-') ? name.split('-').slice(1).join('-') : name;
    // 2) drop file extension
    return withoutPrefix.replace(/\.[^/.]+$/, '');  // removes ".jpg", ".png", etc.
  }

  async function handleDeleteImage(category, filename) {
    const { error } = await supabase.storage.from('aboutus').remove([`${category}/${filename}`]);

    if (error) {
      console.error('Error deleting image:', error.message);
      alert('Failed to delete image.');
    } else {
      alert('Image deleted successfully.');
      // Refresh list after delete
      getAboutUsImages()
    }
  }

  const confirmAndDelete = (category, name) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      handleDeleteImage(category, name);
    }
  };

  async function handleSaveEdit() {
    if (!editModal) return;
    const { category, name } = editModal;
    const oldPath = `${category}/${name}`;
    let currentPath = oldPath;

    try {
      // 1) Replace image data?
      if (newFile) {
        await supabase.storage
          .from('aboutus')
          .upload(oldPath, newFile, { upsert: true }); // overwrite
      }

      // 2) Rename?
      if (newName.trim()) {
        const ext = name.split('.').pop(); // .jpg, .png…
        const newPath = `${category}/${Date.now()}-${newName.trim()}.${ext}`;

        // skip rename if the name didn't actually change
        if (newPath !== oldPath) {
          const { error: copyErr } = await supabase.storage
            .from('aboutus')
            .copy(oldPath, newPath);
          if (copyErr) throw copyErr;

          const { error: delErr } = await supabase.storage
            .from('aboutus')
            .remove([oldPath]);
          if (delErr) throw delErr;

          currentPath = newPath;
        }
      }

      alert('Image updated!');
      setEditModal(null);
      // trigger refresh however you like:
      setUploading((u) => !u);           // flips bool -> useEffect refetches
    } catch (err) {
      console.error(err);
      alert('Update failed: ' + err.message);
    }
  }


  return (
    <div className='ml-[8rem] mt-[5rem] px-4'>
      <NavbarAdmin route={'admin'} routeName1={'maintenance'} />
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => { setFacilitiesTab(false); setnewsandevents(true) }}
          className={`text-2xl font-semibold ${!facilitiesTab ? 'text-blue-600 underline' : ''}`}
        >
          News &amp; Events
        </button>
        <button
          onClick={() => { setFacilitiesTab(true); setnewsandevents(false) }}
          className={`text-2xl font-semibold ${facilitiesTab ? 'text-blue-600 underline' : ''}`}
        >
          Facilities
        </button>
        {/* category select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 w-1/6"
          disabled={uploading}
        >
          <option>Facilities</option>
          <option>Laboratory</option>
          <option>Rooms</option>
        </select>
      </div>
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-semibold">Edit image</h2>

            {/* current preview */}
            <img src={editModal.url} alt={editModal.name} className="rounded-lg max-h-64 object-contain" />

            {/* rename */}
            <input
              type="text"
              defaultValue={prettify(editModal.name)}
              className="w-full border rounded p-2"
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New file name (leave blank to keep current)"
            />

            {/* replace image */}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
              Choose new image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setNewFile(e.target.files?.[0])}
              />
            </label>


            {/* action buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setEditModal(null);
                  setNewFile(null);
                  setNewName('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-[#820000] text-white px-4 py-2 rounded-xl hover:bg-[#a30000]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {facilitiesTab && (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <button
            onClick={() => setModalOpen(true)}
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#820000] bg-white text-[#820000] hover:bg-[#820000] hover:text-white px-4 py-6 rounded-xl shadow h-full min-h-[20rem] transition text-lg font-medium"
          >
            <FiPlus size={32} />
            Add Image
          </button>
          {imagesByCat[category].map(({ name, url }) => (
            <div
              key={url}
              className="relative border p-4 rounded-xl shadow bg-white"
            >
              <img
                src={url}
                alt={name}
                className="mb-4 rounded-lg h-56 w-full object-cover"
              />

              {/* pretty name shown, full name on hover */}
              <p className="text-lg font-semibold mb-1 truncate" title={name}>
                {prettify(name)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditModal({ name, url, category })}
                  className="flex items-center gap-1 text-sm bg-[#820000] text-white px-3 py-1 rounded hover:bg-[#972929] transition"
                >
                  <FiEdit /> Edit
                </button>

                <button
                  onClick={() => confirmAndDelete(category, name)}
                  className="flex items-center gap-1 text-sm bg-[#820000] text-white px-3 py-1 rounded hover:bg-[#972929] transition"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-xl max-w-xl w-full space-y-4">

            {/* choose file */}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
              {uploading ? 'Uploading…' : 'Choose image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setImageFile1(f);
                    setImagePreview1(URL.createObjectURL(f));
                  }
                }}
              />
            </label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            />

            {/* preview */}
            {imagePreview1 && (
              <img
                src={imagePreview1}
                alt="Preview"
                className="rounded-lg max-h-64 object-contain w-full"
              />
            )}

            {/* buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                className="bg-[#820000] text-white px-4 py-2 rounded-xl hover:bg-[#a30000]"
                disabled={!imageFile1 || uploading}
              >
                {uploading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
      {!facilitiesTab && (
        <>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Add News oversized card */}
            <button
              onClick={() => setSelectedArticle({})}
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#820000] bg-white text-[#820000] hover:bg-[#820000] hover:text-white px-4 py-6 rounded-xl shadow h-full min-h-[20rem] transition text-lg font-medium"
            >
              <FiPlus size={32} />
              Add News
            </button>

            {/* News & Events */}
            {sortedArticles.map(article => (
              <div key={article.id} className="relative border p-4 rounded-xl shadow bg-white">
                {/* Tag (top-right) */}
                <div className="absolute top-2 right-2 bg-teal-500 text-white text-sm font-semibold px-2 py-1 rounded">
                  {article.type === 'news' ? 'NEWS' : 'EVENT'}
                </div>

                <img
                  src={article.image}
                  alt="Preview"
                  className="mb-4 rounded-lg h-56 w-full object-cover"
                />
                <p className="text-lg font-semibold mb-1">{article.title}</p>
                <p className="text-sm text-gray-600 mb-2">{article.date}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="flex items-center gap-1 text-sm bg-[#820000] text-white px-3 py-1 rounded hover:bg-[#972929] transition"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal(true)}
                    className="flex items-center gap-1 text-sm bg-[#820000] text-white px-3 py-1 rounded hover:bg-[#972929] transition"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>

                {/* Delete Modal remains unchanged */}
                {deleteModal && (
                  <div className='fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-black/30 z-10' onClick={() => setDeleteModal(false)}>
                    <div className='bg-white rounded-lg p-6 w-full max-w-sm' onClick={(e) => e.stopPropagation()}>
                      <div className='flex flex-col gap-4 text-center'>
                        <p className='text-lg font-medium'>Are you sure you want to delete this News/Event?</p>
                        <div className='flex justify-center gap-4'>
                          <button
                            onClick={() => softDelete(article.id)}
                            className='bg-[#820000] hover:bg-[#972929] text-white py-2 px-4 rounded-md transition'
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteModal(false)}
                            className='bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition'
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedArticle !== null && selectedArticle !== undefined && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 md:p-8 rounded-xl max-w-2xl w-full">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedArticle?.id ? 'Edit News' : 'Add News'}
                </h2>

                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded p-2 mb-4"
                />

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border rounded p-2 mb-4"
                />

                <textarea
                  placeholder="Summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full border rounded p-2 mb-4"
                />

                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border rounded p-2 mb-4"
                >
                  <option value="">Select Type</option>
                  <option value="news">News</option>
                  <option value="event">Event</option>
                </select>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImageFile(e.target.files[0]);
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  }}
                  className="w-full border rounded p-2 mb-4"
                />

                {(imagePreview || formData.image) && (
                  <img
                    src={imagePreview || formData.image}
                    alt="Preview"
                    className="mb-4 rounded-lg max-h-64 object-contain w-full"
                  />
                )}

                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-[#820000] text-white px-4 py-2 rounded-xl hover:bg-[#a30000] transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default page
