'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SubmitPage() {
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [who, setWho] = useState('');
  const [tags, setTags] = useState('');
  const [vibe, setVibe] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('memories').insert([
      {
        event_id: 'producttank-tokyo',
        text,
        name,
        type,
        who,
        tags,
        vibe,
        contact,
      },
    ]);

    setLoading(false);

    if (!error) {
      setSuccess(true);
      setText('');
      setName('');
      setType('');
      setWho('');
      setTags('');
      setVibe('');
      setContact('');
    } else {
      alert('Something went wrong!');
      console.error(error);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🧠 Submit a Memory</h1>
      {success && <p className="mb-4 text-green-600">Thanks for your submission!</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <select
          className="p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">What type of memory is this?</option>
          <option value="quote">A quote I loved</option>
          <option value="lesson">Something I learned</option>
          <option value="person">Someone I met</option>
          <option value="fun">A fun or unexpected moment</option>
          <option value="takeaway">My personal takeaway</option>
        </select>

        <textarea
          className="p-2 border rounded"
          placeholder="What quote or moment stood out to you?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <input
          className="p-2 border rounded"
          placeholder="Who said or did this? (optional)"
          value={who}
          onChange={(e) => setWho(e.target.value)}
        />

        <input
          className="p-2 border rounded"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="p-2 border rounded"
          placeholder="Tags (comma separated, e.g. design, community, growth)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <input
          className="p-2 border rounded"
          placeholder="In one word, what was the vibe of this event?"
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
        />

        <input
          className="p-2 border rounded"
          placeholder="Your contact/social (optional)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Memory'}
        </button>
      </form>
    </main>
  );
}
