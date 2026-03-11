// src/Courses.jsx
import React, { useState, useEffect } from 'react';
import { Clock, PlayCircle, MapPin, Send, DollarSign, Video, Check } from 'lucide-react';
import { getCourses, submitCourseApplication, getUserCourseApplications } from '../api';
import { useOutletContext } from 'react-router-dom';

const Courses = () => {
  const { currentUser } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);

  const [appForm, setAppForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    paymentSlipFile: null,
    paymentSlipBase64: '',
    paymentSlipLink: ''
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

  useEffect(() => {
    const loadApplications = async () => {
      if (!currentUser?.uid) {
        setUserApplications([]);
        return;
      }
      try {
        const apps = await getUserCourseApplications(currentUser.uid);
        setUserApplications(apps);
      } catch (err) {
        console.error('Failed to load user course applications:', err);
      }
    };

    loadApplications();
  }, [currentUser]);

  const handleApply = (course, userApp) => {
    setSelectedCourse(course);
    setSelectedApp(userApp || null);
    setAppForm({
      name: '',
      email: '',
      phone: '',
      notes: '',
      paymentSlipFile: null,
      paymentSlipBase64: '',
      paymentSlipLink: ''
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
    
    if (showApprovedOnly) {
      const app = userApplications.find(a => a.courseId === course.id);
      return matchCategory && matchType && app && app.status === 'approved';
    }
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
    const finalPaymentSlip = appForm.paymentSlipLink.trim() || appForm.paymentSlipBase64;
    if (!finalPaymentSlip) {
      alert('Please upload a payment slip or paste a payment slip link.');
      return;
    }
    try {
      setSubmitting(true);
      if (!currentUser?.uid) {
        alert('Please sign in first.');
        return;
      }
      await submitCourseApplication({
        courseId: selectedCourse.id,
        name: appForm.name,
        email: appForm.email,
        phone: appForm.phone,
        notes: appForm.notes,
        paymentSlip: finalPaymentSlip,
        uid: currentUser.uid,
      });
      alert('Application submitted successfully.');
      setShowApplyModal(false);
      const apps = await getUserCourseApplications(currentUser.uid);
      setUserApplications(apps);
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
              onClick={() => {
                setCategoryFilter('All');
                setTypeFilter('All');
                setShowApprovedOnly(false);
              }}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                categoryFilter === 'All' && typeFilter === 'All' && !showApprovedOnly
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
              }`}
            >
              All Available
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
              onClick={() => {
                setTypeFilter('All');
                setShowApprovedOnly(false);
              }}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                typeFilter === 'All' && !showApprovedOnly
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
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button
              onClick={() => setShowApprovedOnly(!showApprovedOnly)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
                showApprovedOnly
                  ? 'bg-emerald-500 text-black border-emerald-500'
                  : 'bg-white/5 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10'
              }`}
            >
              {showApprovedOnly ? <Check size={12} /> : <Video size={12} />}
              My Approved Courses
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
                        userApp={userApplications.find(a => a.courseId === course.id)}
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
                        userApp={userApplications.find(a => a.courseId === course.id)}
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

              {selectedApp && selectedApp.status === 'approved' ? (
                <div className="space-y-4">
                   <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
                     <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest text-center">
                       Application Approved
                     </p>
                   </div>
                   {selectedCourse.type === 'online' ? (
                     <div className="space-y-4">
                       <h4 className="text-lg font-black text-white italic uppercase">Course Videos</h4>
                       {selectedCourse.youtubeLinks && selectedCourse.youtubeLinks.length > 0 ? (
                         selectedCourse.youtubeLinks.map((link, idx) => {
                           let embedLink = link;
                           if (link.includes('watch?v=')) {
                             embedLink = link.replace('watch?v=', 'embed/');
                           } else if (link.includes('youtu.be/')) {
                             embedLink = link.replace('youtu.be/', 'youtube.com/embed/');
                           }
                           return (
                             <div key={idx} className="aspect-video w-full rounded-xl overflow-hidden border border-white/10">
                               <iframe 
                                 src={embedLink} 
                                 title={`Video ${idx + 1}`}
                                 className="w-full h-full"
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                 allowFullScreen
                               ></iframe>
                             </div>
                           );
                         })
                       ) : (
                         <p className="text-zinc-400 text-sm">No videos available yet.</p>
                       )}
                     </div>
                   ) : (
                     <p className="text-zinc-300 text-sm">You are enrolled in this physical course. Please attend at the location and date specified.</p>
                   )}
                   <button
                     onClick={() => setShowApplyModal(false)}
                     className="w-full py-3 bg-zinc-800/50 border border-white/10 rounded-xl text-white text-sm font-bold uppercase tracking-wider hover:bg-zinc-700 transition-all mt-6"
                   >
                     Close
                   </button>
                </div>
              ) : selectedApp && selectedApp.status === 'pending' ? (
                <div className="space-y-4">
                   <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                     <p className="text-amber-500 text-sm font-bold uppercase tracking-widest text-center">
                       Application Pending Review
                     </p>
                   </div>
                   <button
                     onClick={() => setShowApplyModal(false)}
                     className="w-full py-3 bg-zinc-800/50 border border-white/10 rounded-xl text-white text-sm font-bold uppercase tracking-wider hover:bg-zinc-700 transition-all mt-4"
                   >
                     Close
                   </button>
                </div>
              ) : (
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
                    accept="image/*,.pdf"
                    onChange={handleSlipChange}
                    className="w-full text-xs text-zinc-300"
                  />
                  <input
                    type="url"
                    placeholder="Or paste payment slip link (https://...)"
                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
                    value={appForm.paymentSlipLink}
                    onChange={e => setAppForm(prev => ({ ...prev, paymentSlipLink: e.target.value }))}
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CourseCard = ({ course, categoryColors, onApply, userApp }) => {
  const isOnline = course.type === 'online';

  let btnText = 'View Details / Apply';
  let btnIcon = <Send size={16} />;

  if (userApp) {
    if (userApp.status === 'pending') {
      btnText = 'Application Pending';
      btnIcon = <Clock size={16} />;
    } else if (userApp.status === 'approved') {
      btnText = isOnline ? 'Watch Videos' : 'Enrolled (Details)';
      btnIcon = isOnline ? <Video size={16} /> : <Check size={16} />; // Need to import Check, or use MapPin
    } else if (userApp.status === 'rejected') {
      btnText = 'Application Rejected (Re-apply)';
    }
  }

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
          onClick={() => onApply(course, userApp)}
          className={`w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all flex items-center justify-center gap-2 ${userApp?.status === 'pending' ? 'opacity-80' : ''}`}
        >
          {btnIcon} {btnText}
        </button>
      </div>
    </div>
  );
};

export default Courses;
