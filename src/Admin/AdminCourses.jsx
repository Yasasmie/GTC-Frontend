// src/Admin/AdminCourses.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, Edit3, X, Check, Link2 } from 'lucide-react';
import { getCourses, createCourse, deleteCourse, updateCourse } from '../api';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    category: 'Management',
    type: 'online',
    level: 'Beginner',
    thumbnail: '',
    youtubeLinksText: '', // textarea, one URL per line
    location: '',
    date: '',
    price: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    duration: '',
    category: 'Management',
    type: 'online',
    level: 'Beginner',
    thumbnail: '',
    youtubeLinksText: '',
    location: '',
    date: '',
    price: ''
  });

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const normalizeYoutubeTextToArray = (text) =>
    text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const youtubeLinks = normalizeYoutubeTextToArray(formData.youtubeLinksText);
      await createCourse({
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        category: formData.category,
        type: formData.type,
        level: formData.level,
        thumbnail: formData.thumbnail,
        youtubeLinks,
        location: formData.location,
        date: formData.date,
        price: formData.price ? Number(formData.price) : 0
      });
      setFormData({
        title: '',
        description: '',
        duration: '',
        category: 'Management',
        type: 'online',
        level: 'Beginner',
        thumbnail: '',
        youtubeLinksText: '',
        location: '',
        date: '',
        price: ''
      });
      loadCourses();
    } catch (err) {
      console.error('Failed to add course:', err);
      alert('Failed to add course');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this course?')) {
      try {
        await deleteCourse(id);
        loadCourses();
      } catch (err) {
        console.error('Failed to delete course:', err);
        alert('Failed to delete course');
      }
    }
  };

  const startEdit = (course) => {
    setEditingId(course.id);
    setEditData({
      title: course.title || '',
      description: course.description || '',
      duration: course.duration || '',
      category: course.category || 'Management',
      type: course.type || 'online',
      level: course.level || 'Beginner',
      thumbnail: course.thumbnail || '',
      youtubeLinksText: Array.isArray(course.youtubeLinks)
        ? course.youtubeLinks.join('\n')
        : '',
      location: course.location || '',
      date: course.date || '',
      price: course.price != null ? String(course.price) : ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      title: '',
      description: '',
      duration: '',
      category: 'Management',
      type: 'online',
      level: 'Beginner',
      thumbnail: '',
      youtubeLinksText: '',
      location: '',
      date: '',
      price: ''
    });
  };

  const saveEdit = async (id) => {
    try {
      const youtubeLinks = normalizeYoutubeTextToArray(editData.youtubeLinksText);
      await updateCourse(id, {
        title: editData.title,
        description: editData.description,
        duration: editData.duration,
        category: editData.category,
        type: editData.type,
        level: editData.level,
        thumbnail: editData.thumbnail,
        youtubeLinks,
        location: editData.location,
        date: editData.date,
        price: editData.price ? Number(editData.price) : 0
      });
      cancelEdit();
      loadCourses();
    } catch (err) {
      console.error('Failed to update course:', err);
      alert('Failed to update course');
    }
  };

  const categoryOptions = ['Management', 'Financial', 'Personality Build'];
  const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black text-white italic mb-8 uppercase">
        Course <span className="text-amber-500">Management</span>
      </h1>
      
      {/* Add Course Form */}
      <div className="bg-zinc-900 border border-white/10 p-6 rounded-[2rem] mb-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="COURSE TITLE" 
            className="bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500"
            value={formData.title} 
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <select 
            className="bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          >
            {categoryOptions.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select 
            className="bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="online">Online</option>
            <option value="physical">Physical</option>
          </select>

          <input 
            type="text" 
            placeholder="DURATION (e.g. 4 Hours)" 
            className="bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500"
            value={formData.duration} 
            onChange={e => setFormData({ ...formData, duration: e.target.value })}
            required
          />

          <select 
            className="bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500"
            value={formData.level} 
            onChange={e => setFormData({ ...formData, level: e.target.value })}
          >
            {levelOptions.map(level => (
              <option key={level}>{level}</option>
            ))}
          </select>

          <input 
            type="number"
            min="0"
            step="0.01"
            placeholder="PRICE (USD)" 
            className="bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            required
          />

          <input 
            type="text" 
            placeholder="THUMBNAIL URL" 
            className="bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500"
            value={formData.thumbnail} 
            onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
          />

          {/* Multiple YouTube links: one per line */}
          {formData.type === 'online' && (
            <textarea
              placeholder="YOUTUBE LINKS (one per line)"
              className="bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500 md:col-span-2 h-24"
              value={formData.youtubeLinksText}
              onChange={e => setFormData({ ...formData, youtubeLinksText: e.target.value })}
            />
          )}

          {formData.type === 'physical' && (
            <>
              <input 
                type="text" 
                placeholder="LOCATION" 
                className="bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500"
                value={formData.location} 
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
              <input 
                type="date" 
                placeholder="DATE" 
                className="bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500"
                value={formData.date} 
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </>
          )}

          <textarea 
            placeholder="COURSE DESCRIPTION" 
            className="md:col-span-2 bg-black border border-white/5 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-amber-500 h-24"
            value={formData.description} 
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <button 
            type="submit"
            className="md:col-span-2 bg-amber-500 text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Deploy Course
          </button>
        </form>
      </div>

      {/* Courses List */}
      {loading ? (
        <p className="text-white text-center">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const isEditing = editingId === course.id;

            return (
              <div key={course.id} className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden group">
                <div className="h-40 bg-zinc-800 relative">
                  {course.thumbnail && (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover opacity-60" 
                    />
                  )}
                  <button 
                    onClick={() => handleDelete(course.id)} 
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => (isEditing ? cancelEdit() : startEdit(course))}
                    className="absolute top-4 left-4 p-2 bg-amber-500 text-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-bold"
                  >
                    {isEditing ? <X size={14} /> : <Edit3 size={14} />}
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  {course.type === 'online' && (
                    <div className="absolute bottom-4 left-4 bg-red-500/90 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Link2 size={14} /> {Array.isArray(course.youtubeLinks) ? `${course.youtubeLinks.length} link(s)` : 'Online'}
                    </div>
                  )}
                  {course.type === 'physical' && (
                    <div className="absolute bottom-4 left-4 bg-blue-500/90 text-white px-2 py-1 rounded text-xs font-bold">
                      <MapPin size={14} className="inline mr-1" /> Physical
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <div className="p-6">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">
                      {course.category}
                    </span>
                    <h3 className="text-xl font-black text-white italic uppercase mt-1">
                      {course.title}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-2 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center mt-3 text-xs text-zinc-400">
                      <div className="flex gap-2">
                        <span>{course.level}</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                        <span>•</span>
                        <span>{course.type?.toUpperCase()}</span>
                      </div>
                      <span className="text-amber-400 font-black">
                        {course.price != null ? `$${course.price}` : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 space-y-3 text-xs">
                    <input
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                      value={editData.title}
                      onChange={e => setEditData({ ...editData, title: e.target.value })}
                      placeholder="Title"
                    />
                    <textarea
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500 h-20"
                      value={editData.description}
                      onChange={e => setEditData({ ...editData, description: e.target.value })}
                      placeholder="Description"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                        value={editData.duration}
                        onChange={e => setEditData({ ...editData, duration: e.target.value })}
                        placeholder="Duration"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                        value={editData.price}
                        onChange={e => setEditData({ ...editData, price: e.target.value })}
                        placeholder="Price"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                        value={editData.category}
                        onChange={e => setEditData({ ...editData, category: e.target.value })}
                      >
                        {categoryOptions.map(cat => (
                          <option key={cat}>{cat}</option>
                        ))}
                      </select>
                      <select
                        className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                        value={editData.level}
                        onChange={e => setEditData({ ...editData, level: e.target.value })}
                      >
                        {levelOptions.map(level => (
                          <option key={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <select
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                      value={editData.type}
                      onChange={e => setEditData({ ...editData, type: e.target.value })}
                    >
                      <option value="online">Online</option>
                      <option value="physical">Physical</option>
                    </select>
                    <input
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                      value={editData.thumbnail}
                      onChange={e => setEditData({ ...editData, thumbnail: e.target.value })}
                      placeholder="Thumbnail URL"
                    />
                    <textarea
                      className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500 h-20"
                      value={editData.youtubeLinksText}
                      onChange={e => setEditData({ ...editData, youtubeLinksText: e.target.value })}
                      placeholder="YouTube links (one per line)"
                    />
                    {editData.type === 'physical' && (
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                          value={editData.location}
                          onChange={e => setEditData({ ...editData, location: e.target.value })}
                          placeholder="Location"
                        />
                        <input
                          type="date"
                          className="bg-black border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500"
                          value={editData.date}
                          onChange={e => setEditData({ ...editData, date: e.target.value })}
                        />
                      </div>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-2 rounded-lg bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                      >
                        <X size={14} /> Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(course.id)}
                        className="px-3 py-2 rounded-lg bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                      >
                        <Check size={14} /> Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
