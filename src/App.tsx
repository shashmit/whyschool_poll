import { useState } from 'react';
import { IdeaForm } from './components/IdeaForm';
import { IdeaList } from './components/IdeaList';
import { RankingList } from './components/RankingList';
import './index.css';

function App() {
  const [view, setView] = useState<'submit' | 'vote' | 'ranking'>('submit');

  return (
    <div className="container">
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', textShadow: '4px 4px 0px #ffcc00' }}>
          Idea Poll
        </h1>
        <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button 
            onClick={() => setView('submit')}
            style={{ backgroundColor: view === 'submit' ? '#fff' : 'var(--primary-color)' }}
          >
            Submit Idea
          </button>
          <button 
            onClick={() => setView('vote')}
            style={{ backgroundColor: view === 'vote' ? '#fff' : 'var(--primary-color)' }}
          >
            Vote
          </button>
          <button 
            onClick={() => setView('ranking')}
            style={{ backgroundColor: view === 'ranking' ? '#fff' : 'var(--primary-color)' }}
          >
            Ranking
          </button>
        </nav>
      </header>

      <main>
        {view === 'submit' && (
          <IdeaForm onSuccess={() => setView('vote')} />
        )}
        {view === 'vote' && (
          <IdeaList />
        )}
        {view === 'ranking' && (
          <RankingList />
        )}
      </main>
      
      <footer style={{ marginTop: '50px', textAlign: 'center', borderTop: '3px solid #000', paddingTop: '20px' }}>
        <p>Built with React & Supabase</p>
      </footer>
    </div>
  );
}

export default App;
