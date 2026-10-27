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
  const [loading, setLoading] = useState(false);

  async function createStory() {
    if (!prompt.trim()) {
      setResult('Please enter a story idea first.');
      return;
    }

    setLoading(true);
    setResult('AI story बनाउँदैछ... कृपया पर्खनुहोस्।');

    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div className="logo">SK</div>
        <div>
          <h1>SK AI STUDIO</h1>
          <p>Your creativity, one studio.</p>
        </div>
      </header>

      <section className="hero">
        <span className="badge">✨ ALL-IN-ONE CREATIVE STUDIO</span>
        <h2>
          Create Something
          <br />
          <span>Amazing with AI</span>
        </h2>
        <p>Images, videos, songs, voices and stories — all in one place.</p>
      </section>

      <section className="section">
        <h2>🚀 Choose Your AI Tool</h2>

        <div className="grid">
          {tools.map((tool) => (
            <button
              className={`card ${selected === tool.name ? 'active' : ''}`}
              key={tool.name}
              onClick={() => {
                setSelected(tool.name);
                setResult('');
              }}
            >
              <span className="icon">{tool.icon}</span>
              <strong>{tool.name}</strong>
              <small>{tool.desc}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="creator">
        <h2>
          {tools.find((t) => t.name === selected)?.icon} {selected} Creator
        </h2>

        <p>
          {selected === 'AI Story'
            ? 'Enter an idea to create an original story.'
            : `Enter your idea for ${selected}. Real AI generation requires connecting a compatible AI service.`}
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Describe your ${selected.toLowerCase()} idea...`}
        />

        <button
          className="create-btn"
          disabled={loading}
          onClick={() => {
            if (selected === 'AI Story') {
              void createStory();
            } else {
              setResult(
                `${selected} demo selected.\n\nYour prompt: ${
                  prompt || '(No prompt entered)'
                }\n\nTo generate real content, an AI provider API must be connected.`
              );
            }
          }}
        >
          {loading ? '⏳ Generating...' : `✨ Create ${selected}`}
        </button>

        {result && <div className="result">{result}</div>}
      </section>

      <footer>
        <strong>SK AI STUDIO</strong>
        <p>Made for creators ❤️</p>
        <small>
          AI generation services require compatible provider connections.
        </small>
      </footer>
    </main>
  );
}
