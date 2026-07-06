import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Radio,
  Sparkles,
  Search,
  Navigation,
  Activity,
  Clock,
  Car,
  Footprints,
  Bike,
  XCircle,
  Star
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MapNode } from '../types';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

// Read Google Maps API Key from injected secrets
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface InteractiveMapProps {
  nodes: MapNode[];
  setNodes: React.Dispatch<React.SetStateAction<MapNode[]>>;
}

// Preset Categories
const CATEGORIES = [
  { id: 'cafe', label: 'Cafes', icon: '☕', query: 'cafe' },
  { id: 'restaurant', label: 'Restaurants', icon: '🍽️', query: 'restaurant' },
  { id: 'hospital', label: 'Hospitals', icon: '🏥', query: 'hospital' },
  { id: 'park', label: 'Parks', icon: '🌳', query: 'park' },
  { id: 'tourist', label: 'Attractions', icon: '🏛️', query: 'tourist attraction' },
  { id: 'ev', label: 'EV Stations', icon: '⚡', query: 'EV charging station' },
];

// High-contrast Tactical Cyberpunk Dark Map Styling
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#090d1f' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#090d1f' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#747890' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#06b6d4' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9333ea' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#082020' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#10b981' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0f172a' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f8fafc' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e1b4b' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#c084fc' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#020617' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#020617' }],
  },
];

// Helper: safe photo extractor
const getPhotoUrl = (place: google.maps.places.Place) => {
  if (place.photos && place.photos.length > 0) {
    try {
      return place.photos[0].getURI({ maxWidth: 400 });
    } catch (e) {
      console.warn('Error fetching place photo URI:', e);
    }
  }
  return null;
};

// Route Polylines renderer component
interface RouteRendererProps {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral | null;
  travelMode: 'DRIVING' | 'WALKING' | 'BICYCLING';
  onRouteComputed: (stats: { distance: string; duration: string } | null) => void;
}

const RouteRenderer: React.FC<RouteRendererProps> = ({
  origin,
  destination,
  travelMode,
  onRouteComputed
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !destination) {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
      onRouteComputed(null);
      return;
    }

    // Clear previous routes
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: travelMode as any,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    })
      .then(({ routes }) => {
        if (routes?.[0]) {
          const route = routes[0];
          const newPolylines = route.createPolylines();
          newPolylines.forEach(p => {
            p.setOptions({
              strokeColor: '#06b6d4',
              strokeOpacity: 0.85,
              strokeWeight: 5,
            });
            p.setMap(map);
          });
          polylinesRef.current = newPolylines;

          // Fit bounds to show origin and destination nicely
          if (route.viewport) {
            map.fitBounds(route.viewport);
          }

          // Compute stats
          const meters = route.distanceMeters || 0;
          const durationMs = typeof route.durationMillis === 'number'
            ? route.durationMillis
            : parseInt(String(route.durationMillis || '0'), 10);

          const distanceStr = meters > 1000
            ? `${(meters / 1000).toFixed(1)} km`
            : `${meters} m`;

          const mins = Math.round(durationMs / 60000);
          const durationStr = mins > 60
            ? `${Math.floor(mins / 60)}h ${mins % 60}m`
            : `${mins} mins`;

          onRouteComputed({ distance: distanceStr, duration: durationStr });
        }
      })
      .catch(err => {
        console.error('Error computing routes:', err);
        onRouteComputed(null);
      });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [routesLib, map, origin, destination, travelMode]);

  return null;
};

// API Key Splash Screen
const ApiKeySplash = () => (
  <div className="max-w-7xl mx-auto py-12 px-4 animate-fade-in flex flex-col justify-center items-center">
    <div className="w-full max-w-2xl bg-[#03060f]/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden text-slate-100 flex flex-col justify-center items-center">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-cyan/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-purple/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-purple p-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <div className="w-full h-full bg-[#050811] rounded-2xl flex items-center justify-center">
            <span className="font-display font-bold text-xl text-brand-cyan">C</span>
          </div>
        </div>
        <h2 className="font-display font-bold text-xl tracking-wide text-white">
          Google Maps API Key Required
        </h2>
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
          Tactical Urban Analytics Module
        </p>
      </div>

      <div className="w-full relative">
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 space-y-4 text-xs md:text-sm">
          <p className="text-slate-300 leading-normal">
            To enable satellite navigation, real-world map tiles, and municipal places API searches, please configure your API credentials:
          </p>
          
          <div className="space-y-3 text-slate-400 text-xs">
            <p className="flex items-start gap-2">
              <span className="bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 rounded font-mono font-bold">1</span>
              <span>Get an API Key from the Google Cloud Console.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 rounded font-mono font-bold">2</span>
              <span>Open the <strong>Settings</strong> panel (⚙️ gear icon, top-right corner).</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 rounded font-mono font-bold">3</span>
              <span>Select <strong>Secrets</strong>, click <strong>Add Secret</strong>.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 rounded font-mono font-bold">4</span>
              <span>Name the secret <code>GOOGLE_MAPS_PLATFORM_KEY</code>, paste your API key, and hit Enter.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Inner Map Visualizer containing full hooks context
const InteractiveMapInner: React.FC<InteractiveMapProps> = ({ nodes, setNodes }) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  // Center Singapore default, updated with live location
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>({ lat: 1.3521, lng: 103.8198 });
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 1.3521, lng: 103.8198 });
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Selected place / Selected custom node states
  const [selectedCategory, setSelectedCategory] = useState<string>('restaurant');
  const [nearbyPlaces, setNearbyPlaces] = useState<google.maps.places.Place[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<'node' | 'place' | null>(null);

  // Directions/Route states
  const [routeDestination, setRouteDestination] = useState<google.maps.LatLngLiteral | null>(null);
  const [travelMode, setTravelMode] = useState<'DRIVING' | 'WALKING' | 'BICYCLING'>('DRIVING');
  const [routeStats, setRouteStats] = useState<{ distance: string; duration: string } | null>(null);

  // Mock diagnostics sidebar logic
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticLog, setDiagnosticLog] = useState('');

  // Geolocation trigger
  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
          setIsLocating(false);
        },
        (error) => {
          console.warn('Geolocation failed or denied, using default coordinates.', error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Run on mount
  useEffect(() => {
    handleLocateMe();
  }, []);

  // Search places handler
  const handlePlaceSearch = (queryStr: string) => {
    if (!placesLib || !queryStr) return;
    setIsSearching(true);

    placesLib.Place.searchByText({
      textQuery: queryStr,
      fields: ['id', 'displayName', 'location', 'formattedAddress', 'rating', 'photos', 'types'],
      locationBias: mapCenter,
      maxResultCount: 12,
    })
      .then(({ places }) => {
        setNearbyPlaces(places || []);
        if (places && places.length > 0 && places[0].location) {
          const firstLoc = {
            lat: places[0].location.lat(),
            lng: places[0].location.lng(),
          };
          setMapCenter(firstLoc);
          setSelectedMarker(places[0]);
          setSelectedType('place');
          setRouteDestination(null);
          setRouteStats(null);
        }
      })
      .catch(err => {
        console.error('Error fetching search results:', err);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  // Category change trigger
  const handleCategorySelect = (categoryId: string, catQuery: string) => {
    setSelectedCategory(categoryId);
    if (!placesLib) return;

    setIsSearching(true);
    placesLib.Place.searchByText({
      textQuery: catQuery,
      fields: ['id', 'displayName', 'location', 'formattedAddress', 'rating', 'photos', 'types'],
      locationBias: mapCenter,
      maxResultCount: 15,
    })
      .then(({ places }) => {
        setNearbyPlaces(places || []);
        setRouteDestination(null);
        setRouteStats(null);
      })
      .catch(err => {
        console.error('Error fetching nearby category:', err);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  // Initial load default query once location is mapped
  useEffect(() => {
    if (placesLib && userLocation) {
      handleCategorySelect('restaurant', 'restaurant');
    }
  }, [placesLib, userLocation]);

  // Convert custom percentage SVG nodes into real surrounding spatial nodes
  const getMappedNodes = () => {
    return nodes.map((node) => {
      // Map mock coordinates to a microgrid overlay surrounding the user's location
      const latOffset = (node.coordinates.y - 50) * 0.0003;
      const lngOffset = (node.coordinates.x - 50) * 0.0004;
      return {
        ...node,
        lat: userLocation.lat + latOffset,
        lng: userLocation.lng + lngOffset,
      };
    });
  };

  // Diagnostic calibration triggers
  const runNodeDiagnostics = (nodeId: string) => {
    setIsDiagnosticRunning(true);
    setDiagnosticLog('Initiating port handshakes...');

    setTimeout(() => {
      setDiagnosticLog('Analyzing dynamic response frequencies...');
      setTimeout(() => {
        setDiagnosticLog('All telemetry checks resolved within +1.5% margin. Optimal.');
        setIsDiagnosticRunning(false);

        // Update main state
        setNodes(prev =>
          prev.map(node =>
            node.id === nodeId ? { ...node, status: 'active', metricValue: '100% Calibrated' } : node
          )
        );

        if (selectedMarker && selectedMarker.id === nodeId) {
          setSelectedMarker((prev: any) =>
            prev ? { ...prev, status: 'active', metricValue: '100% Calibrated' } : null
          );
        }
      }, 1500);
    }, 1000);
  };

  // Render variables
  const activeMappedNodes = getMappedNodes();
  const displayNameStr = selectedMarker
    ? typeof selectedMarker.displayName === 'string'
      ? selectedMarker.displayName
      : selectedMarker.displayName?.text || selectedMarker.name || 'Municipal Object'
    : '';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Dynamic Infrastructure Visualizer</h2>
          <p className="text-xs text-slate-400">Tactical spatial maps integrated with Google Places, route computation, and CityMind telemetry.</p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id, cat.query)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-slate-950 font-bold shadow-lg shadow-brand-cyan/25'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="mr-1.5">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Map Container */}
        <div className="lg:col-span-8 space-y-4 flex flex-col">
          {/* Controls top subheader */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Custom search field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePlaceSearch(searchQuery);
              }}
              className="flex-grow flex gap-2"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search for custom locations or municipalities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-brand-cyan text-brand-cyan rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Locate me button */}
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="px-4 py-2.5 bg-brand-cyan/10 border border-brand-cyan/20 hover:bg-brand-cyan/25 text-brand-cyan rounded-xl text-xs font-semibold transition-all flex items-center gap-2 justify-center cursor-pointer shrink-0"
            >
              <Navigation size={14} className={isLocating ? 'animate-spin' : ''} />
              <span>Locate Me</span>
            </button>
          </div>

          <GlassCard className="p-0 overflow-hidden relative flex-grow min-h-[500px] lg:min-h-[550px] flex flex-col justify-between" hoverEffect={false}>
            {/* Floating Top indicators overlay */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
              <div className="glass px-3 py-1.5 rounded-xl border border-slate-800/80 text-[10px] font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                <span>LOCATION: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
              </div>
              {selectedCategory && (
                <div className="glass px-3 py-1.5 rounded-xl border border-slate-800/80 text-[10px] font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
                  <span>FILTER: {selectedCategory.toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Google Map Implementation */}
            <div className="w-full h-full min-h-[440px] flex-grow relative">
              <Map
                defaultZoom={14}
                center={mapCenter}
                mapId="DEMO_MAP_ID"
                clickableIcons={false}
                gestureHandling="greedy"
                disableDefaultUI={true}
                styles={DARK_MAP_STYLE}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%', minHeight: '440px' }}
              >
                {/* User Location Pulsing Pulse Marker */}
                <AdvancedMarker position={userLocation} title="Your Location">
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-brand-cyan opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-cyan border-2 border-white shadow-lg"></span>
                  </div>
                </AdvancedMarker>

                {/* Nearby Places Markers */}
                {nearbyPlaces.map((place, idx) => {
                  if (!place.location) return null;
                  const isSelected = selectedType === 'place' && selectedMarker?.id === place.id;
                  const pos = { lat: place.location.lat(), lng: place.location.lng() };

                  return (
                    <AdvancedMarker
                      key={place.id || idx}
                      position={pos}
                      onClick={() => {
                        setSelectedMarker(place);
                        setSelectedType('place');
                        // Center on clicked place
                        setMapCenter(pos);
                      }}
                    >
                      <div className={`cursor-pointer transition-transform duration-300 hover:scale-110 flex items-center justify-center ${
                        isSelected ? 'scale-110 z-40' : 'z-30'
                      }`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 shadow-2xl relative ${
                          isSelected
                            ? 'bg-brand-cyan border-white text-slate-950 scale-110'
                            : 'bg-[#090d1f]/90 border-brand-cyan/40 text-brand-cyan'
                        }`}>
                          <span className="text-sm">
                            {selectedCategory === 'cafe' ? '☕' :
                             selectedCategory === 'restaurant' ? '🍽' :
                             selectedCategory === 'hospital' ? '🏥' :
                             selectedCategory === 'park' ? '🌳' :
                             selectedCategory === 'tourist' ? '🏛' : '⚡'}
                          </span>
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}

                {/* Custom CityMind Sensor Hubs Overlay Markers */}
                {activeMappedNodes.map((node) => {
                  const isSelected = selectedType === 'node' && selectedMarker?.id === node.id;
                  const pos = { lat: node.lat, lng: node.lng };

                  return (
                    <AdvancedMarker
                      key={node.id}
                      position={pos}
                      onClick={() => {
                        setSelectedMarker(node);
                        setSelectedType('node');
                        setMapCenter(pos);
                      }}
                    >
                      <div className={`cursor-pointer transition-transform duration-300 hover:scale-115 flex items-center justify-center ${
                        isSelected ? 'scale-110 z-50' : 'z-30'
                      }`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 shadow-xl ${
                          isSelected
                            ? 'bg-brand-purple border-white text-white shadow-brand-purple/40 scale-110'
                            : 'bg-slate-950/90 border-brand-purple/40 text-brand-purple'
                        }`}>
                          {node.type === 'hub' ? (
                            <Sparkles size={14} />
                          ) : node.type === 'grid' ? (
                            <Radio size={14} />
                          ) : (
                            <MapPin size={14} />
                          )}
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}

                {/* Routes/Directions Display Polyline */}
                <RouteRenderer
                  origin={userLocation}
                  destination={routeDestination}
                  travelMode={travelMode}
                  onRouteComputed={(stats) => setRouteStats(stats)}
                />
              </Map>
            </div>

            {/* Bottom Info Tip bar */}
            <div className="p-4 border-t border-slate-800/60 bg-slate-950/80 text-[10px] text-slate-500 font-mono flex items-center gap-2 justify-center">
              <Compass size={12} className="animate-spin [animation-duration:15s] text-brand-cyan" />
              <span>CLICK ANY REAL-WORLD PLACE OR TELEMETRY SENSOR HUB MARKER TO INITIATE MUNICIPAL AUDIT</span>
            </div>
          </GlassCard>
        </div>

        {/* Telemetry & Places Detail Sidebar Card */}
        <div className="lg:col-span-4">
          <GlassCard className="h-full flex flex-col justify-between" hoverEffect={false}>
            {selectedMarker ? (
              <div className="space-y-6">
                {/* 1. Places Sidebar View */}
                {selectedType === 'place' && (
                  <div className="space-y-5">
                    {/* Cover photo if exists */}
                    {getPhotoUrl(selectedMarker) && (
                      <div className="w-full h-36 rounded-2xl overflow-hidden relative border border-white/5 shadow-inner">
                        <img
                          src={getPhotoUrl(selectedMarker) || ''}
                          alt={displayNameStr}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#040815] via-[#040815]/30 to-transparent" />
                      </div>
                    )}

                    {/* Place Metadata */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-0.5 rounded-full">
                          REAL PLACE
                        </span>
                        {selectedMarker.rating && (
                          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            <span>{selectedMarker.rating}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-base text-white">{displayNameStr}</h3>
                      <p className="text-xs text-slate-400 leading-normal">{selectedMarker.formattedAddress}</p>
                    </div>

                    {/* Routing / Navigation segment */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/60">
                      <h4 className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                        <Navigation size={13} className="text-brand-cyan" />
                        <span>MUNICIPAL ROUTING SYSTEM</span>
                      </h4>

                      <div className="flex gap-1.5">
                        {[
                          { id: 'DRIVING', label: 'Drive', icon: Car },
                          { id: 'WALKING', label: 'Walk', icon: Footprints },
                          { id: 'BICYCLING', label: 'Cycle', icon: Bike },
                        ].map((mode) => {
                          const Icon = mode.icon;
                          const isSel = travelMode === mode.id;
                          return (
                            <button
                              key={mode.id}
                              onClick={() => setTravelMode(mode.id as any)}
                              className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                                isSel
                                  ? 'bg-brand-cyan/15 border-brand-cyan text-brand-cyan shadow-sm'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              <Icon size={12} />
                              <span>{mode.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Display Route calculation states */}
                      {routeStats ? (
                        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-brand-cyan/5 border border-brand-cyan/10">
                          <div>
                            <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-mono">Distance</span>
                            <span className="text-sm font-display font-bold text-white mt-0.5 block">{routeStats.distance}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-mono">Duration</span>
                            <span className="text-sm font-display font-bold text-brand-cyan mt-0.5 block font-mono">{routeStats.duration}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 italic">No route overlay mapped.</p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (selectedMarker.location) {
                              setRouteDestination({
                                lat: selectedMarker.location.lat(),
                                lng: selectedMarker.location.lng(),
                              });
                            }
                          }}
                          className="flex-grow py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-cyan to-brand-blue hover:brightness-110 text-slate-950 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Navigation size={13} />
                          <span>Compute Route</span>
                        </button>
                        
                        {routeDestination && (
                          <button
                            onClick={() => {
                              setRouteDestination(null);
                              setRouteStats(null);
                            }}
                            className="p-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
                            title="Clear Route"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Custom Cyberpunk Telemetry Sensor Node View */}
                {selectedType === 'node' && (
                  <div className="space-y-5 animate-fade-in">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-0.5 rounded-full">
                          {selectedMarker.type.toUpperCase()} UNIT
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                          selectedMarker.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                            : selectedMarker.status === 'alert'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {selectedMarker.status}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-base text-white">{selectedMarker.name}</h3>
                      <p className="text-xs text-slate-400 leading-normal">{selectedMarker.description}</p>
                    </div>

                    {/* Live Telemetry stream */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/60">
                      <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">LIVE TELEMETRY STREAM</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                          <span className="text-[9px] text-slate-500 block truncate uppercase tracking-wider font-mono">{selectedMarker.metricName}</span>
                          <span className="text-sm font-display font-bold text-white mt-1 block">
                            {selectedMarker.metricValue}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                          <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-mono">Relative Latency</span>
                          <span className="text-sm font-display font-bold text-brand-cyan mt-1 block font-mono">
                            14.2 ms
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Calibration overrides */}
                    <div className="space-y-3 pt-4 border-t border-slate-800/60">
                      <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">ADMIN OVERRIDES</h4>
                      
                      {isDiagnosticRunning ? (
                        <div className="p-3 rounded-xl bg-brand-purple/5 border border-brand-purple/20 text-[11px] space-y-2">
                          <div className="flex items-center gap-2 text-brand-purple font-semibold">
                            <Activity className="animate-spin" size={14} />
                            <span>Running Core Diagnostics...</span>
                          </div>
                          <p className="text-slate-400 font-mono text-[10px] animate-pulse">{diagnosticLog}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button
                            onClick={() => runNodeDiagnostics(selectedMarker.id)}
                            className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-purple to-brand-blue hover:brightness-110 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Settings size={14} />
                            <span>Calibrate & Diagnose</span>
                          </button>
                          
                          {selectedMarker.status === 'alert' && (
                            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 leading-normal flex gap-2">
                              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                              <span>This unit reports high-frequency baseline shifts. Calibrate recommended.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-24 text-center space-y-4 text-slate-500">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <Compass size={24} className="animate-spin [animation-duration:20s]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">No object selected</p>
                  <p className="text-[10px] max-w-xs leading-normal">Select an infrastructure sensor or real-world municipal place on the spatial dashboard to load active telemetry streams and route overlays.</p>
                </div>
              </div>
            )}

            {/* Core systems footer status */}
            <div className="mt-8 pt-4 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1"><Radio size={10} className="text-emerald-500 animate-pulse" /> SYS_LIVE</span>
              <span>CITYMIND SECURE PLATFORM</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

// Top-level exported module wrapping inner map with provider
export const InteractiveMap: React.FC<InteractiveMapProps> = ({ nodes, setNodes }) => {
  if (!hasValidKey) {
    return <ApiKeySplash />;
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly" libraries={['maps', 'places', 'marker', 'routes', 'geometry', 'core']}>
      <InteractiveMapInner nodes={nodes} setNodes={setNodes} />
    </APIProvider>
  );
};
