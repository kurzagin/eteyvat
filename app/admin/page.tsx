"use client";

import { useState, useEffect, useRef } from "react";

type Entity = {
  id: number;
  kind: string;
  name: string;
  image: string | null;
};

export default function AdminDashboard() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [missingFilter, setMissingFilter] = useState(false);
  
  // A mapping of entity IDs that failed to load their images
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  const searchEntities = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entities?limit=100&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setEntities(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchEntities(query);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleImageError = (id: number) => {
    setBrokenImages(prev => ({ ...prev, [id]: true }));
  };

  const handleUploadClick = (id: number) => {
    setUploadingId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadingId === null) return;

    try {
      // 1. Upload to Vercel Blob
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // 2. Update Entity in DB
      const updateRes = await fetch(`/api/admin/entities/${uploadingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customImageUrl: data.url }),
      });

      if (!updateRes.ok) throw new Error("Failed to update database");

      // 3. Update local state
      setEntities(prev => prev.map(ent => 
        ent.id === uploadingId ? { ...ent, image: data.url } : ent
      ));
      
      // Clear broken state for this item if it existed
      setBrokenImages(prev => ({ ...prev, [uploadingId]: false }));

    } catch (error) {
      alert("Upload failed. Please check your Vercel Blob configuration.");
      console.error(error);
    } finally {
      setUploadingId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const displayedEntities = missingFilter 
    ? entities.filter(e => !e.image || brokenImages[e.id])
    : entities;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Asset Manager</h1>
          <p className="text-gray-400">Search and replace images for database entities.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entities (e.g. Wayob)..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-teal-500 outline-none"
        />
        <button
          onClick={() => setMissingFilter(!missingFilter)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            missingFilter 
              ? 'bg-amber-600 text-white' 
              : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {missingFilter ? "Show All" : "Show Missing Only"}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />

      {loading ? (
        <div className="text-gray-400 text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayedEntities.map((entity) => {
            const isBroken = !entity.image || brokenImages[entity.id];
            return (
              <div key={entity.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden flex flex-col group relative">
                <div className="aspect-square bg-gray-900 flex items-center justify-center p-4 relative">
                  {isBroken ? (
                    <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700 shadow-inner">
                      <span className="text-xl font-bold text-teal-500/50">
                        {entity.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={entity.image!}
                      alt={entity.name}
                      className="w-full h-full object-contain"
                      onError={() => handleImageError(entity.id)}
                    />
                  )}
                  
                  {isBroken && (
                    <div className="absolute top-2 right-2 bg-amber-500/10 text-amber-500 text-xs font-bold px-2 py-1 rounded border border-amber-500/20">
                      Missing
                    </div>
                  )}
                </div>
                
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-teal-400 mb-1 uppercase tracking-wider">
                      {entity.kind}
                    </div>
                    <div className="text-sm text-gray-200 line-clamp-2" title={entity.name}>
                      {entity.name}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUploadClick(entity.id)}
                    disabled={uploadingId === entity.id}
                    className="mt-3 w-full bg-gray-700 hover:bg-teal-600 text-white text-xs py-1.5 rounded transition-colors disabled:opacity-50"
                  >
                    {uploadingId === entity.id ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {displayedEntities.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No entities found matching your criteria.
        </div>
      )}
    </div>
  );
}
