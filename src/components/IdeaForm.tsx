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
      <h2 style={{ marginBottom: '20px' }}>// SUBMIT_IDEA</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>PROJECT_NAME:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="ENTER_NAME_HERE"
          />
        </div>
        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>DESCRIPTION:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="ENTER_DESCRIPTION_HERE"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="tagline" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>TAGLINE (OPTIONAL):</label>
          <input
            id="tagline"
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="ENTER_SLOGAN_HERE"
          />
        </div>
        {error && <div style={{ backgroundColor: '#000', color: 'red', padding: '10px', fontWeight: 'bold', marginBottom: '20px' }}>ERROR: {error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', fontSize: '2rem' }}>
          {loading ? 'PROCESSING...' : 'SUBMIT_TO_DATABASE'}
        </button>
      </form>
    </div>
  );
};
