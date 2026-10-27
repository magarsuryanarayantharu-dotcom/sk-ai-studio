import { useState } from 'react';

const tools = [
  { name: 'AI Image', icon: '🎨', desc: 'Create amazing AI images' },
  { name: 'AI Video', icon: '🎬', desc: 'Create videos from prompts' },
  { name: 'AI Song', icon: '🎵', desc: 'Make your own songs' },
  { name: 'AI Voice', icon: '🎙️', desc: 'Create voiceovers' },
  { name: 'AI Story', icon: '📖', desc: 'Write original stories' },
];

export default function App() {
  const [selected, setSelected] = useState('AI Story');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');

  async function createStory() {
  if (!prompt.trim()) {
    setResult('Please enter a story idea first.');
    return;
  }

  setResult('AI story बनाउँदैछ... कृपया पर्खनुहोस्।');

  try {
    const response = await fetch('/api/story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        language: 'Hindi',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Story बनाउन सकिएन।');
    }

    setResult(data.story || 'कथा प्राप्त भएन।');
  } catch (error) {
    setResult(
      error instanceof Error
        ? error.message
        : 'केही समस्या भयो। फेरि प्रयास गर्नुहोस्।'
    );
  }
}
