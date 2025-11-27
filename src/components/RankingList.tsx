import React, { useEffect, useState } from 'react';
import type { Idea } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:54321/functions/v1/poll-api';

export const RankingList: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch(`${API_URL}?sort=votes`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch ranking');
        const data = await response.json();
        setIdeas(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) return <div>Loading ranking...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Top Ideas</h2>
      {ideas.map((idea, index) => (
        <div key={idea.id} className={`card ${index === 0 ? 'primary' : index === 1 ? 'secondary' : index === 2 ? 'accent' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>#{index + 1} {idea.name}</h3>
            <div className="badge" style={{ fontSize: '1.2rem' }}>{idea.votes} Votes</div>
          </div>
          {idea.tagline && <p><em>{idea.tagline}</em></p>}
          <p>{idea.description}</p>
        </div>
      ))}
    </div>
  );
};
