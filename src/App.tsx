import { useState } from 'react';
import { IdeaForm } from './components/IdeaForm';
import { IdeaList } from './components/IdeaList';
import { RankingList } from './components/RankingList';
import { InteractiveGrid } from './components/InteractiveGrid';
import './index.css';

function App() {
  const [view, setView] = useState<'submit' | 'vote' | 'ranking'>('submit');

  return (
    <>
      <InteractiveGrid />
      <div className="marquee-container">
        <div className="marquee-content">
          *** WELCOME TO THE IDEA POLL SYSTEM *** SUBMIT YOUR BEST IDEAS *** VOTE FOR THE WINNERS *** SYSTEM STATUS: OPERATIONAL ***
        </div>
      </div>
      <div className="container">
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '20px' }}>
            IDEA_POLL_SYSTEM
          </h1>
          <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setView('submit')}
              className={view === 'submit' ? 'active' : ''}
              style={{ 
                backgroundColor: view === 'submit' ? 'var(--primary-color)' : '#fff',
                color: view === 'submit' ? '#fff' : '#000',
                transform: view === 'submit' ? 'translate(-4px, -4px)' : 'none',
                boxShadow: view === 'submit' ? 'calc(var(--shadow-offset) + 4px) calc(var(--shadow-offset) + 4px) 0px 0px #000' : 'var(--shadow-offset) var(--shadow-offset) 0px 0px #000'
              }}
            >
              Submit_Idea
            </button>
            <button 
              onClick={() => setView('vote')}
              style={{ 
                backgroundColor: view === 'vote' ? 'var(--secondary-color)' : '#fff',
                color: view === 'vote' ? '#fff' : '#000',
                transform: view === 'vote' ? 'translate(-4px, -4px)' : 'none',
                boxShadow: view === 'vote' ? 'calc(var(--shadow-offset) + 4px) calc(var(--shadow-offset) + 4px) 0px 0px #000' : 'var(--shadow-offset) var(--shadow-offset) 0px 0px #000'
              }}
            >
              Vote_Now
            </button>
            <button 
              onClick={() => setView('ranking')}
              style={{ 
                backgroundColor: view === 'ranking' ? 'var(--accent-color)' : '#fff',
                color: '#000',
                transform: view === 'ranking' ? 'translate(-4px, -4px)' : 'none',
                boxShadow: view === 'ranking' ? 'calc(var(--shadow-offset) + 4px) calc(var(--shadow-offset) + 4px) 0px 0px #000' : 'var(--shadow-offset) var(--shadow-offset) 0px 0px #000'
              }}
            >
              View_Ranking
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
        
        <footer style={{ marginTop: '80px', textAlign: 'center', borderTop: '4px solid #000', paddingTop: '20px', fontWeight: 'bold' }}>
          <p>/// END_OF_LINE ///</p>
        </footer>
      </div>
    </>
  );
}

export default App;
