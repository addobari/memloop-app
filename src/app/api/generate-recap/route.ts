// src/app/api/generate-recap/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  const memoriesRes = await supabase
    .from('memories')
    .select('id, text, type, who, name, tags, vibe')
    .order('created_at', { ascending: true });

  if (memoriesRes.error) {
    return NextResponse.json({ error: memoriesRes.error.message }, { status: 500 });
  }

  const memories = memoriesRes.data;

  const memoryList = memories
    .map((m) => `- ${m.text} ${m.name ? `(by ${m.name})` : ''}`)
    .join('\n');

  const prompt = `
You are an event reflection and storytelling assistant.

The following is a list of real memories shared by attendees at an event. Your job is to help the organizer reflect and take action.

Output must be in JSON with this structure:
{
  "understanding": {
    "themes": [
      { "point": "<short phrase>", "why": "<why it mattered>" },
      ...
    ],
    "quotes": [
      { "text": "<quote>", "author": "<name or Anonymous>", "memoryId": "<optional id>" },
      ...
    ]
  },
  "exports": {
    "tweetThread": ["...", "..."],
    "linkedinRecap": "...",
    "emailFollowUp": ["...", "..."]
  }
}

MEMORIES:
${memoryList}
`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await res.json();

  try {
    const json = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    return NextResponse.json({ result: json });
  } catch (e) {
    console.error('Failed to parse JSON from OpenAI:', data);
    return NextResponse.json({ error: 'Invalid JSON output from AI.' }, { status: 500 });
  }
}
