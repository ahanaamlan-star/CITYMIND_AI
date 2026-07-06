import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  ThumbsUp,
  MapPin,
  Calendar,
  Filter,
  Plus,
  X,
  CheckCircle2,
  Send,
  Sparkles,
  User,
  Image as ImageIcon,
  Trash2,
  Search,
  Clock,
  ShieldAlert,
  Map as MapIcon,
  Maximize2
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { CommunityReport } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap
} from '@vis.gl/react-google-maps';

// Read Google Maps API Key
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Issue Categories as requested
const ISSUE_CATEGORIES = [
  'Potholes',
  'Garbage',
  'Water Leakage',
  'Broken Street Lights',
  'Flooding',
  'Traffic Congestion',
  'Public Safety',
  'Pollution'
] as const;

// Combined list for filtering old & new items safely
const ALL_CATEGORIES = [
  'All',
  ...ISSUE_CATEGORIES,
  'Infrastructure',
  'Utilities',
  'Safety',
  'Ecological',
  'Other'
];

// Dark Map style for consistency
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#090d1f' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#090d1f' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#747890' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#06b6d4' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#9333ea' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#082020' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#10b981' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020617' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] }
];

// Image compressor helper
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Compressed JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface CommunityReportsProps {
  reports: CommunityReport[];
  setReports: React.Dispatch<React.SetStateAction<CommunityReport[]>>;
}

export const CommunityReports: React.FC<CommunityReportsProps> = ({ reports, setReports }) => {
  const { user, userProfile } = useAuth();
  
  // UI states
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activePriority, setActivePriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedImageLightbox, setSelectedImageLightbox] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<any>('Potholes');
  const [location, setLocation] = useState('');
  const [formLat, setFormLat] = useState<number>(45.14);
  const [formLng, setFormLng] = useState<number>(34.58);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map state
  const [mapCenter, setMapCenter] = useState({ lat: 45.14, lng: 34.58 });

  // Update form coordinates on locate user or load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setMapCenter(loc);
          setFormLat(loc.lat);
          setFormLng(loc.lng);
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    setIsUploading(true);
    try {
      const compressed = await compressImage(file);
      setImageUrl(compressed);
    } catch (err) {
      console.error('Image upload processing failed:', err);
      alert('Failed to process image file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVote = async (id: string) => {
    if (!user) return;
    
    const report = reports.find(r => r.id === id);
    if (!report) return;

    const votersList = report.voters || [];
    const hasVoted = votersList.includes(user.uid);
    let newVoters: string[];
    let newVotes: number;

    if (hasVoted) {
      newVoters = votersList.filter(uid => uid !== user.uid);
      newVotes = Math.max(0, report.votes - 1);
    } else {
      newVoters = [...votersList, user.uid];
      newVotes = report.votes + 1;
    }

    // Optimistic UI updates
    setReports(prev =>
      prev.map(rep => {
        if (rep.id === id) {
          return {
            ...rep,
            votes: newVotes,
            voters: newVoters,
            userVoted: !hasVoted
          };
        }
        return rep;
      })
    );

    try {
      const reportRef = doc(db, 'reports', id);
      await updateDoc(reportRef, {
        votes: newVotes,
        voters: newVoters
      });
      showToast(hasVoted ? 'Vote withdrawn.' : 'Upvote registered successfully.');
    } catch (err) {
      console.error('Failed to vote:', err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `reports/${id}`);
      } catch (fErr) {}
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to retract this report?')) return;

    // Optimistic UI
    setReports(prev => prev.filter(r => r.id !== id));

    try {
      const reportRef = doc(db, 'reports', id);
      await deleteDoc(reportRef);
      showToast('Report withdrawn successfully.');
    } catch (err) {
      console.error('Failed to delete:', err);
      try {
        handleFirestoreError(err, OperationType.DELETE, `reports/${id}`);
      } catch (fErr) {}
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'open' | 'investigating' | 'resolved') => {
    // Optimistic update
    setReports(prev =>
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );

    try {
      const reportRef = doc(db, 'reports', id);
      await updateDoc(reportRef, { status: newStatus });
      showToast(`Status updated to ${newStatus}.`);
    } catch (err) {
      console.error('Failed to update status:', err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `reports/${id}`);
      } catch (fErr) {}
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title || !description || !location) {
      alert('Please provide a title, description, and geographical landmark.');
      return;
    }

    setIsSubmitting(true);
    const newId = `rep_${Date.now()}`;
    const reportData: CommunityReport = {
      id: newId,
      title,
      description,
      category,
      status: 'open',
      votes: 1,
      userVoted: true,
      voters: [user.uid],
      location,
      latitude: formLat,
      longitude: formLng,
      reportedBy: userProfile?.name || user.displayName || user.email?.split('@')[0] || 'Citizen',
      reportedByUid: user.uid,
      reportedAt: new Date().toISOString(),
      priority,
      imageUrl: imageUrl || undefined
    };

    try {
      const reportRef = doc(db, 'reports', newId);
      await setDoc(reportRef, reportData);
      
      setIsFormOpen(false);
      showToast('Report submitted to local municipal grid.');
      
      // Clear form
      setTitle('');
      setDescription('');
      setLocation('');
      setCategory('Potholes');
      setPriority('medium');
      setImageUrl('');
    } catch (err) {
      console.error('Failed to store report in Firestore:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, `reports/${newId}`);
      } catch (fErr) {
        alert('Could not submit report. Check project security rules & limits.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reverse geocoding helper on marker click / drag
  const reverseGeocode = (lat: number, lng: number) => {
    if (typeof window !== 'undefined' && (window as any).google?.maps?.Geocoder) {
      const geocoder = new (window as any).google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
        if (status === 'OK' && results?.[0]) {
          setLocation(results[0].formatted_address);
        }
      });
    }
  };

  // Filter reports
  const filteredReports = reports.filter(rep => {
    const matchesCategory = activeCategory === 'All' || rep.category === activeCategory;
    const matchesPriority = activePriority === 'All' || rep.priority === activePriority;
    const matchesSearch =
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  // Calculate statistics for high quality overview cards
  const totalCount = reports.length;
  const openCount = reports.filter(r => r.status === 'open').length;
  const investigatingCount = reports.filter(r => r.status === 'investigating').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;

  // Category Colors Map
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Potholes':
        return { bg: 'bg-[#ff7e47]/10 text-[#ff7e47] border-[#ff7e47]/20', emoji: '🕳️' };
      case 'Garbage':
        return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', emoji: '🗑️' };
      case 'Water Leakage':
        return { bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', emoji: '💧' };
      case 'Broken Street Lights':
        return { bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', emoji: '💡' };
      case 'Flooding':
        return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', emoji: '🌊' };
      case 'Traffic Congestion':
        return { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', emoji: '🚗' };
      case 'Public Safety':
        return { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', emoji: '🛡️' };
      case 'Pollution':
        return { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', emoji: '💨' };
      default:
        return { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20', emoji: '📋' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 relative">
      
      {/* Lightbox for Image Preview */}
      <AnimatePresence>
        {selectedImageLightbox && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImageLightbox(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl max-h-[85vh] relative"
            >
              <img 
                src={selectedImageLightbox} 
                alt="Enlarged Report Attachment" 
                className="max-w-full max-h-[80vh] rounded-2xl border border-white/10 object-contain shadow-2xl"
              />
              <button 
                onClick={() => setSelectedImageLightbox(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white flex items-center gap-2 text-xs font-semibold"
              >
                <X size={16} /> Close Preview
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl glass border border-brand-cyan/20 text-brand-cyan shadow-2xl font-sans"
          >
            <Sparkles size={16} className="text-brand-cyan shrink-0" />
            <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
            Community Incident Grid
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time municipal portal tracking safety, infrastructure breakdowns, hazards, and complaints filed by verified local citizens.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-brand-blue to-brand-purple text-white hover:brightness-115 rounded-xl transition-all shadow-[0_4px_20px_rgba(147,51,234,0.15)] flex items-center gap-2 cursor-pointer"
        >
          <Plus size={15} />
          <span>Report New Hazard</span>
        </button>
      </div>

      {/* Grid Stats Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-mono text-[9px] uppercase font-bold">Total Dispatches</span>
            <span className="p-1 rounded-lg bg-slate-800 text-slate-400 text-xs"><Clock size={12} /></span>
          </div>
          <p className="text-2xl font-bold font-display text-white mt-1">{totalCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Issues reported to municipal servers</p>
        </GlassCard>

        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-brand-blue font-mono text-[9px] uppercase font-bold">Open Tasks</span>
            <span className="p-1 rounded-lg bg-brand-blue/10 text-brand-blue text-xs"><Clock size={12} /></span>
          </div>
          <p className="text-2xl font-bold font-display text-brand-blue mt-1">{openCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Awaiting investigation or dispatcher assign</p>
        </GlassCard>

        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-amber-400 font-mono text-[9px] uppercase font-bold">Under Review</span>
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs"><ShieldAlert size={12} /></span>
          </div>
          <p className="text-2xl font-bold font-display text-amber-400 mt-1">{investigatingCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Maintenance teams actively inspecting onsite</p>
        </GlassCard>

        <GlassCard className="p-4" hoverEffect={false}>
          <div className="flex justify-between items-start">
            <span className="text-emerald-400 font-mono text-[9px] uppercase font-bold">Resolved Issues</span>
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs"><CheckCircle2 size={12} /></span>
          </div>
          <p className="text-2xl font-bold font-display text-emerald-400 mt-1">{resolvedCount}</p>
          <p className="text-[10px] text-slate-500 mt-1">Successfully resolved & closed by staff</p>
        </GlassCard>
      </div>

      {/* Dynamic Map overview of all current filtered reports */}
      {hasValidKey && filteredReports.length > 0 && (
        <GlassCard className="p-0 overflow-hidden" hoverEffect={false}>
          <div className="p-3 border-b border-white/5 bg-slate-900/40 flex justify-between items-center px-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <MapIcon size={12} className="text-brand-cyan" /> Geographic Incident Matrix ({filteredReports.length} Plotted)
            </span>
            <span className="text-[9px] text-slate-500 font-mono">MAP ID: DEMO_MAP_ID</span>
          </div>
          <div className="w-full h-64 relative">
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                defaultZoom={13}
                center={mapCenter}
                mapId="DEMO_MAP_ID"
                clickableIcons={false}
                gestureHandling="cooperative"
                disableDefaultUI={true}
                styles={DARK_MAP_STYLE}
              >
                {filteredReports.map((rep) => (
                  <AdvancedMarker
                    key={rep.id}
                    position={{ lat: rep.latitude, lng: rep.longitude }}
                    title={rep.title}
                  >
                    <div className="relative flex flex-col items-center group cursor-pointer">
                      <div className={`p-2 rounded-xl border flex items-center justify-center shadow-2xl relative transition-all duration-300 group-hover:scale-110 ${
                        rep.priority === 'high' 
                          ? 'bg-rose-950/90 border-rose-500 text-rose-400' 
                          : rep.priority === 'medium'
                          ? 'bg-amber-950/90 border-amber-500 text-amber-400'
                          : 'bg-slate-950/90 border-slate-700 text-slate-400'
                      }`}>
                        <span className="text-sm shrink-0">{getCategoryTheme(rep.category).emoji}</span>
                      </div>
                      <div className="absolute top-full mt-1.5 hidden group-hover:block z-50 glass px-2 py-1 rounded-lg border border-slate-800 text-[9px] font-semibold text-white whitespace-nowrap shadow-2xl max-w-xs">
                        <p className="font-bold font-sans">{rep.title}</p>
                        <p className="text-[8px] text-slate-400 font-mono">{rep.location}</p>
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}
              </Map>
            </APIProvider>
          </div>
        </GlassCard>
      )}

      {/* Filter and Search Bar Options */}
      <div className="flex flex-col gap-4">
        {/* Search Input & Priority Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Filter incidents by title, description, landmark, or block..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/40 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/40 transition-all"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            {/* Priority Picker Dropdown */}
            <div className="relative">
              <select
                value={activePriority}
                onChange={(e) => setActivePriority(e.target.value)}
                className="bg-slate-900/40 border border-white/5 text-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-cyan/40 appearance-none font-sans font-semibold pr-8 cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={12} />
            </div>
          </div>
        </div>

        {/* Categories Pills Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
          <span className="text-[10px] text-slate-500 font-mono uppercase font-bold shrink-0 mr-2 flex items-center gap-1">
            <Filter size={11} /> Filters:
          </span>
          {ALL_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            const theme = getCategoryTheme(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-md'
                    : 'bg-slate-900/40 text-slate-400 border border-white/5 hover:text-white hover:bg-slate-850/60'
                }`}
              >
                {cat !== 'All' && <span className="mr-1">{theme.emoji}</span>}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Incident List Feed Grid */}
      {filteredReports.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center py-12 glass border border-white/5 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-900/80 border border-white/5 flex items-center justify-center text-slate-400">
            <Filter size={20} className="text-slate-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">No matching incident logs</p>
            <p className="text-[10px] text-slate-500 max-w-xs leading-normal">
              No municipal alerts match the active search queries or category filter boundaries. Reset filters or submit a new dispatch above.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map(rep => {
            const isOwner = user && rep.reportedByUid === user.uid;
            const theme = getCategoryTheme(rep.category);
            
            return (
              <GlassCard key={rep.id} className="p-5 flex flex-col justify-between" hoverEffect={true}>
                <div className="space-y-4">
                  {/* Category, Status, Priority */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${theme.bg}`}>
                        <span>{theme.emoji}</span>
                        <span>{rep.category}</span>
                      </span>

                      <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-lg border ${
                        rep.priority === 'high' 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                          : rep.priority === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {rep.priority} severity
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Interactive Admin status toggler if owner / staff */}
                      {isOwner ? (
                        <select
                          value={rep.status}
                          onChange={(e: any) => handleStatusChange(rep.id, e.target.value)}
                          className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-lg border bg-slate-900 border-white/10 text-slate-300 outline-none cursor-pointer focus:border-brand-cyan/40`}
                        >
                          <option value="open">Open</option>
                          <option value="investigating">Investigating</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      ) : (
                        <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-lg border ${
                          rep.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : rep.status === 'investigating'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                        }`}>
                          {rep.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
                      {rep.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{rep.description}</p>
                  </div>

                  {/* Base64 Local Image Attachment */}
                  {rep.imageUrl && (
                    <div className="relative group rounded-xl overflow-hidden border border-white/5 bg-slate-950 max-h-48 flex items-center justify-center">
                      <img 
                        src={rep.imageUrl} 
                        alt="Local upload attachment" 
                        className="w-full h-full object-cover max-h-48 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                      <button 
                        onClick={() => setSelectedImageLightbox(rep.imageUrl || null)}
                        className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-white/10 text-white/90 shadow-lg text-[10px] flex items-center gap-1 font-semibold transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Maximize2 size={11} /> Zoom
                      </button>
                    </div>
                  )}

                  {/* Landmark and dates metadata */}
                  <div className="space-y-1.5 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-sans">
                      <MapPin size={12} className="text-brand-cyan shrink-0" />
                      <span className="truncate">{rep.location}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} className="shrink-0" />
                        Reported {new Date(rep.reportedAt).toLocaleDateString()} {new Date(rep.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>COORD: {rep.latitude.toFixed(4)}, {rep.longitude.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                {/* Voter action block and control buttons */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                    <User size={11} className="text-brand-purple" />
                    <span className="truncate max-w-[120px] font-semibold">{rep.reportedBy}</span>
                    {isOwner && <span className="text-[9px] bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan font-semibold px-1.5 rounded">You</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Delete capability if reporter */}
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(rep.id)}
                        className="p-2 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 transition-all cursor-pointer"
                        title="Withdraw Incident Report"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}

                    <button
                      onClick={() => handleVote(rep.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        rep.userVoted
                          ? 'bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan shadow-sm shadow-brand-cyan/5'
                          : 'bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <ThumbsUp size={11} />
                      <span>{rep.votes} Upvotes</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Slide-over Drawer Form for creating reports */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-[#02050c]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 20 }}
              className="w-full max-w-2xl glass border border-white/10 rounded-2xl p-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] my-8"
            >
              {/* Close Drawer Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg border border-white/5 bg-slate-900/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-white">File Local Citizen Report</h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Filing a report dispatches alerts directly to municipal dashboards and local public works maintenance staff.
                  </p>
                </div>

                {/* Form fields layout split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left Column: Form Details */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">Incident Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Broken streetlight cycle, hazardous water leak..."
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-brand-cyan/40"
                        maxLength={150}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">Detailed Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide structural dimensions, details, hazards, and surrounding safety considerations..."
                        rows={4}
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-brand-cyan/40 resize-none"
                        maxLength={2000}
                        required
                      />
                    </div>

                    {/* Category & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">Category</label>
                        <select
                          value={category}
                          onChange={(e: any) => setCategory(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none cursor-pointer"
                        >
                          {ISSUE_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">Severity</label>
                        <select
                          value={priority}
                          onChange={(e: any) => setPriority(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none cursor-pointer"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                    </div>

                    {/* Image Attachment File input */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">Image Attachment</label>
                      {imageUrl ? (
                        <div className="relative rounded-xl overflow-hidden border border-brand-cyan/20 bg-slate-950 max-h-36 flex items-center justify-center p-1">
                          <img 
                            src={imageUrl} 
                            alt="Upload Attachment Preview" 
                            className="h-28 object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="absolute top-2 right-2 p-1 bg-slate-950 border border-white/10 hover:bg-slate-900 text-rose-400 rounded-lg transition-all cursor-pointer"
                            title="Remove attachment"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="border border-dashed border-white/10 rounded-xl p-4 bg-slate-950/20 hover:bg-slate-950/40 text-center transition-all relative flex flex-col items-center justify-center space-y-1">
                          <ImageIcon size={22} className="text-slate-500" />
                          <div className="text-[10px] text-slate-400">
                            <span className="font-bold text-brand-cyan hover:underline cursor-pointer">Choose local file</span> or drop here
                          </div>
                          <span className="text-[9px] text-slate-500">Formats: JPG, PNG (Auto-compressed)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </div>
                      )}
                      {isUploading && <p className="text-[9px] text-brand-cyan font-mono animate-pulse mt-1">Squeezing dimensions & compressing local image stream...</p>}
                    </div>
                  </div>

                  {/* Right Column: Google Maps Location Picker */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">Landmark / Landmark Address</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="District 2, intersection of Broadway & 4th..."
                        className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-brand-cyan/40"
                        required
                      />
                    </div>

                    <div className="space-y-1 flex-grow flex flex-col justify-end">
                      <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                        Place Marker on Municipal Grid Picker
                      </label>
                      
                      <div className="w-full h-56 rounded-xl border border-white/10 overflow-hidden bg-slate-950 relative">
                        {hasValidKey ? (
                          <APIProvider apiKey={API_KEY} version="weekly">
                            <Map
                              defaultZoom={14}
                              center={{ lat: formLat, lng: formLng }}
                              mapId="PICKER_MAP"
                              clickableIcons={false}
                              disableDefaultUI={true}
                              styles={DARK_MAP_STYLE}
                              onClick={(e) => {
                                if (e.detail.latLng) {
                                  const lat = e.detail.latLng.lat;
                                  const lng = e.detail.latLng.lng;
                                  setFormLat(lat);
                                  setFormLng(lng);
                                  reverseGeocode(lat, lng);
                                }
                              }}
                            >
                              <AdvancedMarker
                                position={{ lat: formLat, lng: formLng }}
                                title="Picked Coordinates"
                              />
                            </Map>
                          </APIProvider>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-950 text-slate-500">
                            <MapIcon size={24} className="mb-2 text-slate-600 animate-pulse" />
                            <p className="text-[10px] font-bold text-slate-400 font-mono uppercase">Interactive Picker offline</p>
                            <p className="text-[9px] max-w-xs mt-0.5">VITE_GOOGLE_MAPS_PLATFORM_KEY is missing. You can adjust coordinates manually below.</p>
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 z-10 bg-slate-950/85 px-2 py-1 border border-white/5 text-[8px] font-mono rounded text-slate-400">
                          CLICK MAP TO POSITION DISPATCH
                        </span>
                      </div>

                      {/* Manual coordinate inputs */}
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-500 font-mono block">LATITUDE</span>
                          <input
                            type="number"
                            step="any"
                            value={formLat}
                            onChange={(e) => setFormLat(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-2.5 py-1.5 text-[10px] text-white font-mono outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-500 font-mono block">LONGITUDE</span>
                          <input
                            type="number"
                            step="any"
                            value={formLng}
                            onChange={(e) => setFormLng(parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-2.5 py-1.5 text-[10px] text-white font-mono outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Dispatch Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-blue text-xs font-bold text-white hover:brightness-110 active:brightness-95 rounded-xl transition-all shadow-[0_4px_20px_rgba(6,182,212,0.15)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles size={13} className="animate-spin" />
                      <span>Transmitting Citizen Dispatch...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Transmit Official Incident Dispatch</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
