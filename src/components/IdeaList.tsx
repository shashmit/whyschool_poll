import React, { useEffect, useState } from 'react';
import type { Idea } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:54321/functions/v1/poll-api';

export const IdeaList: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voted, setVoted] = useState<string | null>(localStorage.getItem('votedIdeaId'));

  const fetchIdeas = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch ideas');
      const data = await response.json();
      setIdeas(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleVote = async (ideaId: string) => {
    if (voted) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'vote', idea_id: ideaId }),
      });

      if (!response.ok) throw new Error('Failed to vote');

      setVoted(ideaId);
      localStorage.setItem('votedIdeaId', ideaId);
      fetchIdeas(); // Refresh list to show updated votes (optional, or just optimistically update)
    } catch (err: any) {
      alert('Error voting: ' + err.message);
    }
  };

  if (loading) return <div>Loading ideas...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>// VOTE_FOR_BEST</h2>
      {ideas.length === 0 ? (
        <div className="card">
          <p>NO_IDEAS_FOUND_IN_DATABASE</p>
        </div>
      ) : (
        ideas.map((idea, index) => (
          <div key={idea.id} className="card" style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f0f0f0' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>{idea.name}</h3>
            {idea.tagline && <div className="badge" style={{ backgroundColor: 'var(--accent-color)', color: '#000', marginBottom: '15px' }}>{idea.tagline}</div>}
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>{idea.description}</p>
            <button 
              onClick={() => handleVote(idea.id)} 
              disabled={!!voted}
              style={{ 
                width: '100%', 
                backgroundColor: voted === idea.id ? '#000' : 'var(--secondary-color)',
                color: '#fff',
                border: '4px solid #000'
              }}
            >
              {voted === idea.id ? 'VOTE_REGISTERED' : 'VOTE_THIS_IDEA'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};
