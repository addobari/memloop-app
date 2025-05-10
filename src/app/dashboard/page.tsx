// src/app/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ClipboardCopy, Twitter, Linkedin, Mail } from 'lucide-react';

type Memory = {
  id: string;
  text: string;
  name?: string;
  who?: string;
  tags?: string;
  vibe?: string;
  contact?: string;
  created_at: string;
  type?: string;
};

type Recap = {
  understanding: {
    themes: { point: string; why: string; memoryId?: string }[];
    quotes: { text: string; author?: string; memoryId?: string }[];
  };
  exports: {
    tweetThread: string[];
    linkedinRecap: string;
    emailFollowUp: string[];
  };
};

type Theme = { point: string; why: string; memoryId?: string };
type Quote = { text: string; author?: string; memoryId?: string };

export default function Dashboard() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [recap, setRecap] = useState<Recap | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<string>('');

  useEffect(() => {
    const fetchMemories = async () => {
      const { data, error } = await supabase.from('memories').select('*').order('created_at', { ascending: false });
      if (!error) setMemories(data || []);
      setLoading(false);
    };
    fetchMemories();
  }, []);

  const generateRecap = async () => {
    setGenerating(true);
    const res = await fetch('/api/generate-recap', { method: 'POST' });
    const data = await res.json();
    setRecap(data.result || null);
    setGenerating(false);
  };

  const scrollToMemory = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const shareOnTwitter = (text: string) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = (text: string) => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = (text: string) => {
    const url = `mailto:?subject=Event Recap&body=${encodeURIComponent(text)}`;
    window.open(url);
  };

  return (
       <main className="max-w-6xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <span className="text-purple-700">🧠</span> Organizer Dashboard
      </h1>

      <div className="space-y-4">
        <button
          onClick={generateRecap}
          disabled={generating}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          {generating ? 'Generating AI Recap...' : '🪄 Generate AI Recap'}
        </button>
      </div>

      {recap && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 border rounded shadow">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-purple-700">🧠 Understanding</h2>
            <div>
              <h3 className="text-lg font-semibold">Key Themes</h3>
              <ul className="list-disc ml-5 text-sm">
                {recap?.understanding?.themes?.map((t: Theme, idx: number) => (
                  <li key={idx}>
                    <strong>{t.point}</strong>: {t.why}
                    {t.memoryId && (
                      <sup>
                        <button
                          onClick={() => t.memoryId && scrollToMemory(t.memoryId)}
                          className="text-blue-600 hover:underline ml-1"
                        >
                          [{idx + 1}]
                        </button>
                      </sup>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-4">Memorable Quotes</h3>
              <ul className="space-y-2">
                {recap?.understanding?.quotes?.slice(0, 5).map((q: Quote, idx: number) => (
                  <li key={idx}>
                    <blockquote
                      onClick={() => q.memoryId && scrollToMemory(q.memoryId)}
                      className="cursor-pointer border-l-4 pl-4 italic text-sm hover:bg-purple-50 hover:text-purple-800 transition"
                    >
                      “{q.text}” — {q.author || 'Anonymous'}
                    </blockquote>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-purple-700">📤 Exportable Content</h2>

            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">🔥 Tweet Thread</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(recap.exports.tweetThread.join('\n'), 'tweet')}
                    title="Copy"
                    className="hover:text-purple-700 transition"
                  >
                    <ClipboardCopy size={16} />
                  </button>
                  <button
                    onClick={() => shareOnTwitter(recap.exports.tweetThread[0])}
                    title="Share on Twitter"
                    className="hover:text-purple-700 transition"
                  >
                    <Twitter size={16} />
                  </button>
                </div>
              </div>
              <ul className="list-decimal ml-5 text-sm space-y-1">
                {recap.exports.tweetThread.map((tweet: string, idx: number) => (
                  <li key={idx}>{tweet}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">✍️ LinkedIn Recap</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(recap.exports.linkedinRecap, 'linkedin')}
                    title="Copy"
                    className="hover:text-purple-700 transition"
                  >
                    <ClipboardCopy size={16} />
                  </button>
                  <button
                    onClick={() => shareOnLinkedIn(recap.exports.linkedinRecap)}
                    title="Share on LinkedIn"
                    className="hover:text-purple-700 transition"
                  >
                    <Linkedin size={16} />
                  </button>
                </div>
              </div>
              <p className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
                {recap.exports.linkedinRecap}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">📩 Email Follow-Up</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(recap.exports.emailFollowUp.join('\n'), 'email')}
                    title="Copy"
                    className="hover:text-purple-700 transition"
                  >
                    <ClipboardCopy size={16} />
                  </button>
                  <button
                    onClick={() => shareViaEmail(recap.exports.emailFollowUp.join('\n'))}
                    title="Send via Email"
                    className="hover:text-purple-700 transition"
                  >
                    <Mail size={16} />
                  </button>
                </div>
              </div>
              <ul className="list-disc ml-5 text-sm">
                {recap.exports.emailFollowUp.map((line: string, idx: number) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-2">✅ {copied} copied to clipboard</p>
            )}
          </div>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">📚 Raw Submissions</h2>
        {loading ? (
          <p>Loading memories...</p>
        ) : memories.length === 0 ? (
          <p className="text-gray-600">No memories submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {memories.map((m) => (
              <li id={m.id} key={m.id} className="border rounded p-4 bg-gray-50">
                <p className="text-base">{m.text}</p>
                <div className="text-sm text-gray-500 mt-2 space-y-1">
                  {m.name && <div>👤 {m.name}</div>}
                  {m.type && <div>📌 {m.type}</div>}
                  {m.who && <div>🗣️ {m.who}</div>}
                  {m.tags && <div>🏷 {m.tags}</div>}
                  {m.vibe && <div>🎧 Vibe: {m.vibe}</div>}
                  {m.contact && <div>📬 {m.contact}</div>}
                  <div>🕒 {new Date(m.created_at).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
