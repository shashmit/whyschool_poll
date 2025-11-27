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
      <h2>Vote for the Best Idea</h2>
      {ideas.length === 0 ? (
        <p>No ideas submitted yet.</p>
      ) : (
        ideas.map((idea) => (
          <div key={idea.id} className="card">
            <h3>{idea.name}</h3>
            {idea.tagline && <div className="badge">{idea.tagline}</div>}
            <p>{idea.description}</p>
            <button 
              onClick={() => handleVote(idea.id)} 
              disabled={!!voted}
              style={{ opacity: voted ? 0.5 : 1 }}
            >
              {voted === idea.id ? 'Voted!' : 'Vote This'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};
