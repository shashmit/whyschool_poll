import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:54321/functions/v1/poll-api';

export const IdeaForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, tagline }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit idea');
      }

      setName('');
      setDescription('');
      setTagline('');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card primary">
      <h2>Submit Your Idea</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name"><strong>Name *</strong></label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Project Name"
          />
        </div>
        <div>
          <label htmlFor="description"><strong>Description *</strong></label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe your idea..."
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="tagline"><strong>Tagline</strong> (Optional)</label>
          <input
            id="tagline"
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="A catchy slogan"
          />
        </div>
        {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Idea'}
        </button>
      </form>
    </div>
  );
};
