'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Memory = {
  id: string;
  text: string;
  name?: string;
  type?: string;
  who?: string;
  tags?: string;
  vibe?: string;
  contact?: string;
  created_at: string;
};

export default function Dashboard() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching memories:', error);
      } else {
        setMemories(data || []);
      }

      setLoading(false);
    };

    fetchMemories();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🧠 Organizer Dashboard</h1>

      {loading && <p>Loading memories...</p>}

      {!loading && memories.length === 0 && (
        <p className="text-gray-600">No memories submitted yet.</p>
      )}

      <ul className="space-y-6">
        {memories.map((memory) => (
          <li key={memory.id} className="border rounded p-4 shadow-sm">
            <p className="text-lg">{memory.text}</p>
            <div className="text-sm text-gray-500 mt-2 space-y-1">
              {memory.name && <div>👤 <strong>{memory.name}</strong></div>}
              {memory.type && <div>📌 Type: {memory.type}</div>}
              {memory.who && <div>🗣️ About: {memory.who}</div>}
              {memory.tags && <div>🏷 Tags: {memory.tags}</div>}
              {memory.vibe && <div>🎧 Vibe: {memory.vibe}</div>}
              {memory.contact && <div>📬 Contact: {memory.contact}</div>}
              <div>🕒 {new Date(memory.created_at).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
