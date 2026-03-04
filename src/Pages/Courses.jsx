// src/Courses.jsx
import React, { useState, useEffect } from 'react';
import { Clock, PlayCircle, MapPin, Send, DollarSign } from 'lucide-react';
import { getCourses, submitCourseApplication } from '../api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const [appForm, setAppForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    paymentSlipFile: null,
    paymentSlipBase64: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesData();
  }, []);

  const handleApply = (course) => {
    setSelectedCourse(course);
    setAppForm({
      name: '',
      email: '',
      phone: '',
      notes: '',
      paymentSlipFile: null,
      paymentSlipBase64: ''
    });
    setShowApplyModal(true);
  };

  const categoryColors = {
    Management: 'from-blue-500 to-blue-600',
    Financial: 'from-green-500 to-green-600',
    'Personality Build': 'from-purple-500 to-purple-600',
  };

  const allCategories = ['Management', 'Financial', 'Personality Build'];

  const filteredCourses = courses.filter((course) => {
    const matchCategory =
      categoryFilter === 'All' || course.category === categoryFilter;
    const matchType =
      typeFilter === 'All' || course.type === typeFilter;
    return matchCategory && matchType;
  });

  const groupByCategoryAndType = () => {
    const grouped = {};
    filteredCourses.forEach((course) => {
      const cat = course.category || 'Other';
      const type = course.type || 'online';
      if (!grouped[cat]) {
        grouped[cat] = { online: [], physical: [] };
      }
      if (!grouped[cat][type]) {
        grouped[cat][type] = [];
      }
      grouped[cat][type].push(course);
    });
    return grouped;
  };

  const groupedCourses = groupByCategoryAndType();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading courses...</div>
      </div>
    );
  }

  const hasAnyCourse = filteredCourses.length > 0;

  const handleSlipChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAppForm(prev => ({ ...prev, paymentSlipFile: null, paymentSlipBase64: '' }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setAppForm(prev => ({
        ...prev,
        paymentSlipFile: file,
        paymentSlipBase64: typeof base64 === 'string' ? base64 : ''
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;
    if (!appForm.paymentSlipBase64) {
      alert('Please upload a payment slip image.');
      return;
    }
    try {
      setSubmitting(true);
      await submitCourseApplication({
        courseId: selectedCourse.id,
        name: appForm.name,
        email: appForm.email,
        phone: appForm.phone,
        notes: appForm.notes,
        paymentSlip: appForm.paymentSlipBase64,
      });
      alert('Application submitted successfully.');
      setShowApplyModal(false);
    } catch (err) {
      console.error('Failed to submit application:', err);
      alert('Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="animate-in fade-in duration-700 p-8">
        <header className="mb-8">
          <h2 className="text-sm font-black text-amber-500 uppercase tracking-[0.3em] mb-2">
            Educational Portal
          </h2>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">
            Trading <span className="text-amber-500">Academy</span>
          </h1>
        </header>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap gap-4 items-center">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('All')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                categoryFilter === 'All'
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
              }`}
            >
              All Categories
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  categoryFilter === cat
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 ml-auto">
            <button
              onClick={() => setTypeFilter('All')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                typeFilter === 'All'
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('online')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                typeFilter === 'online'
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
              }`}
            >
              Online
            </button>
            <button
              onClick={() => setTypeFilter('physical')}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                typeFilter === 'physical'
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
              }`}
            >
              Physical
            </button>
          </div>
        </div>

        {!hasAnyCourse && (
          <p className="text-zinc-500 text-sm">
            No courses found for the selected filters.
          </p>
        )}

        {/* Sections per category */}
        {Object.entries(groupedCourses).map(([category, byType]) => {
          const hasOnline = byType.online && byType.online.length > 0;
          const hasPhysical = byType.physical && byType.physical.length > 0;
          if (!hasOnline && !hasPhysical) return null;

          return (
            <section key={category} className="mb-10">
              <h2 className="text-2xl font-black text-white italic uppercase mb-4 flex items-center gap-3">
                <span>{category}</span>
                <span className="h-px flex-1 bg-white/10" />
              </h2>

              {hasOnline && (
                <>
                  <h3 className="text-sm font-black text-emerald-400 uppercase tracking-[0.25em] mb-3">
                    Online Courses
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
                    {byType.online.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        categoryColors={categoryColors}
                        onApply={handleApply}
                      />
                    ))}
                  </div>
                </>
              )}

              {hasPhysical && (
                <>
                  <h3 className="text-sm font-black text-sky-400 uppercase tracking-[0.25em] mb-3">
                    Physical Courses
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {byType.physical.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        categoryColors={categoryColors}
                        onApply={handleApply}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>

      {/* Apply / Details Modal */}
      {showApplyModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-white/10">
              <h3 className="text-2xl font-black text-white italic uppercase mb-2">
                {selectedCourse.title}
              </h3>
              <p className="text-zinc-400 text-sm mb-2">
                Category: <span className="font-semibold">{selectedCourse.category}</span>
              </p>
              <p className="text-zinc-400 text-sm mb-2">
                Delivery:{' '}
                <span className="font-semibold">
                  {selectedCourse.type === 'physical' ? 'Physical' : 'Online'}
                </span>
              </p>
              <p className="text-zinc-400 text-sm mb-2">
                Duration: <span className="font-semibold">{selectedCourse.duration}</span>
              </p>
              <p className="text-zinc-400 text-sm mb-2">
                Level: <span className="font-semibold">{selectedCourse.level}</span>
              </p>
              {selectedCourse.type === 'physical' && (
                <>
                  <p className="text-zinc-400 text-sm mb-1">
                    Location:{' '}
                    <span className="font-semibold">
                      {selectedCourse.location || 'TBA'}
                    </span>
                  </p>
                  <p className="text-zinc-400 text-sm mb-1">
                    Date:{' '}
                    <span className="font-semibold">
                      {selectedCourse.date || 'Schedule will be announced'}
                    </span>
                  </p>
                </>
              )}
              {selectedCourse.price != null && (
                <p className="text-amber-400 text-sm font-black mt-2">
                  Price: ${selectedCourse.price}
                </p>
              )}
            </div>
            
            <div className="p-8">
              <p className="text-zinc-300 text-sm mb-3">
                Course Overview
              </p>
              <p className="text-zinc-400 text-sm mb-6 whitespace-pre-line">
                {selectedCourse.description}
              </p>

              <form onSubmit={handleSubmitApplication} className="space-y-3">
                <p className="text-zinc-300 text-sm mb-2 font-bold uppercase tracking-widest">
                  Apply for this course
                </p>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
                  value={appForm.name}
                  onChange={e => setAppForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
                  value={appForm.email}
                  onChange={e => setAppForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
                  value={appForm.phone}
                  onChange={e => setAppForm(prev => ({ ...prev, phone: e.target.value }))}
                />
                <textarea
                  placeholder="Notes (optional)"
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500 h-20"
                  value={appForm.notes}
                  onChange={e => setAppForm(prev => ({ ...prev, notes: e.target.value }))}
                />
                <div className="space-y-1">
                  <p className="text-zinc-400 text-xs">
                    Upload payment slip (image, max a few MB).
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlipChange}
                    className="w-full text-xs text-zinc-300"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 py-3 bg-zinc-800/50 border border-white/10 rounded-xl text-white text-sm font-bold uppercase tracking-wider hover:bg-zinc-700 transition-all"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 text-black font-black rounded-xl uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    disabled={submitting}
                  >
                    <Send size={16} />
                    {submitting ? 'Submitting...' : 'Apply Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CourseCard = ({ course, categoryColors, onApply }) => {
  const isOnline = course.type === 'online';

  return (
    <div className="bg-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden hover:border-amber-500/30 transition-all group">
      <div className="aspect-video bg-zinc-900 relative">
        <img 
          src={course.thumbnail || '/course-placeholder.jpg'} 
          className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" 
          alt={course.title} 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {isOnline ? (
            <PlayCircle className="text-white/20 group-hover:text-amber-500 transition-colors" size={48} />
          ) : (
            <MapPin className="text-white/20 group-hover:text-amber-500 transition-colors" size={48} />
          )}
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <span
            className={`px-3 py-1 border text-[9px] font-black uppercase tracking-widest rounded-full bg-gradient-to-r ${
              categoryColors[course.category] || 'from-gray-500 to-gray-600'
            }`}
          >
            {course.category}
          </span>
          <div className="flex items-center gap-2 text-zinc-300 text-[10px] font-bold uppercase">
            {course.price != null && (
              <>
                <DollarSign size={12} />
                <span>${course.price}</span>
              </>
            )}
          </div>
        </div>
        <h3 className="text-2xl font-black text-white italic uppercase leading-none mb-3">
          {course.title}
        </h3>
        <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-6 line-clamp-3">
          {course.description}
        </p>

        <button
          onClick={() => onApply(course)}
          className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all flex items-center justify-center gap-2"
        >
          <Send size={16} /> View Details / Apply
        </button>
      </div>
    </div>
  );
};

export default Courses;
