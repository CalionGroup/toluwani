import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [yesClicked, setYesClicked] = useState(false);
  const [catMood, setCatMood] = useState('neutral');
  const [hearts, setHearts] = useState([]);
  const [responseSent, setResponseSent] = useState(false);

  useEffect(() => {
    // Generate floating hearts
    const heartPositions = [
      { x: '15%', y: '30%', delay: 0, duration: 3 },
      { x: '80%', y: '25%', delay: 0.5, duration: 3.5 },
      { x: '10%', y: '60%', delay: 1, duration: 3.2 },
      { x: '85%', y: '55%', delay: 1.5, duration: 3.8 },
      { x: '50%', y: '20%', delay: 0.8, duration: 3.3 },
      { x: '25%', y: '70%', delay: 1.2, duration: 3.6 },
      { x: '75%', y: '75%', delay: 0.3, duration: 3.4 },
    ];
    setHearts(heartPositions);
  }, []);

  const sendResponse = async (choice) => {
    if (responseSent) return;
    setResponseSent(true);
    try {
      await fetch('/api/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice }),
      });
    } catch {
      setResponseSent(false);
    }
  };

  const handleNoHover = () => {
    setNoHoverCount(prev => prev + 1);
    setCatMood('worried');
    
    // Get the button dimensions
    const button = document.querySelector('.no-button');
    if (!button) return;
    
    const buttonRect = button.getBoundingClientRect();
    const containerRect = button.parentElement.getBoundingClientRect();
    
    // Calculate safe bounds to keep button in view
    const maxX = containerRect.width - buttonRect.width - 20;
    const maxY = containerRect.height - buttonRect.height - 20;
    
    // Generate random position
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    setNoButtonPos({ x: randomX, y: randomY });
    
    // Reset cat mood after animation
    setTimeout(() => setCatMood('neutral'), 500);
  };

  const handleYesClick = () => {
    setYesClicked(true);
    setCatMood('happy');
    sendResponse('yes');
  };

  const handleNoClick = () => {
    handleNoHover(); // Move button on click too
    sendResponse('no');
  };

  if (yesClicked) {
    return (
      <div className="app success">
        {hearts.map((heart, i) => (
          <div
            key={i}
            className="floating-heart"
            style={{
              left: heart.x,
              top: heart.y,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`,
            }}
          >
            ❤️
          </div>
        ))}
        <div className="success-content">
          <div className="cat-container celebration">
            <svg className="cat" viewBox="0 0 200 200" width="250" height="250">
              {/* Happy cat with hearts */}
              <g className="cat-body">
                {/* Body */}
                <ellipse cx="100" cy="120" rx="50" ry="55" fill="#fff" stroke="#2c1810" strokeWidth="3"/>
                
                {/* Ears */}
                <path d="M 70 80 L 60 50 L 85 75 Z" fill="#fff" stroke="#2c1810" strokeWidth="3"/>
                <path d="M 130 80 L 140 50 L 115 75 Z" fill="#fff" stroke="#2c1810" strokeWidth="3"/>
                
                {/* Head */}
                <circle cx="100" cy="90" r="45" fill="#fff" stroke="#2c1810" strokeWidth="3"/>
                
                {/* Eyes - happy/closed */}
                <path d="M 85 85 Q 88 90 91 85" stroke="#2c1810" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <path d="M 109 85 Q 112 90 115 85" stroke="#2c1810" strokeWidth="3" fill="none" strokeLinecap="round"/>
                
                {/* Blush */}
                <circle cx="70" cy="95" r="8" fill="#ffb6c1" opacity="0.6"/>
                <circle cx="130" cy="95" r="8" fill="#ffb6c1" opacity="0.6"/>
                
                {/* Mouth - big smile */}
                <path d="M 90 100 Q 100 110 110 100" stroke="#2c1810" strokeWidth="3" fill="none" strokeLinecap="round"/>
                
                {/* Nose */}
                <path d="M 100 95 L 95 100 L 105 100 Z" fill="#2c1810"/>
                
                {/* Whiskers */}
                <line x1="60" y1="92" x2="40" y2="88" stroke="#2c1810" strokeWidth="2"/>
                <line x1="60" y1="98" x2="40" y2="100" stroke="#2c1810" strokeWidth="2"/>
                <line x1="140" y1="92" x2="160" y2="88" stroke="#2c1810" strokeWidth="2"/>
                <line x1="140" y1="98" x2="160" y2="100" stroke="#2c1810" strokeWidth="2"/>
                
                {/* Arms - celebrating */}
                <ellipse cx="60" cy="110" rx="12" ry="30" fill="#fff" stroke="#2c1810" strokeWidth="3" transform="rotate(-30 60 110)"/>
                <ellipse cx="140" cy="110" rx="12" ry="30" fill="#fff" stroke="#2c1810" strokeWidth="3" transform="rotate(30 140 110)"/>
              </g>
            </svg>
          </div>
          <h1 className="success-title">Yay! 💕</h1>
          <p className="success-message">I knew you'd say yes!</p>
          <div className="heart-burst">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="burst-heart" style={{ '--i': i }}>❤️</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {hearts.map((heart, i) => (
        <div
          key={i}
          className="floating-heart"
          style={{
            left: heart.x,
            top: heart.y,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          ❤️
        </div>
      ))}
      
      <div className="content">
        <div className={`cat-container ${catMood}`}>
          <svg className="cat" viewBox="0 0 200 200" width="200" height="200">
            <g className="cat-body">
              {/* Body */}
              <ellipse cx="100" cy="120" rx="50" ry="55" fill="#fff" stroke="#2c1810" strokeWidth="3"/>
              
              {/* Ears */}
              <path d="M 70 80 L 60 50 L 85 75 Z" fill="#fff" stroke="#2c1810" strokeWidth="3"/>
              <path d="M 130 80 L 140 50 L 115 75 Z" fill="#fff" stroke="#2c1810" strokeWidth="3"/>
              
              {/* Head */}
              <circle cx="100" cy="90" r="45" fill="#fff" stroke="#2c1810" strokeWidth="3"/>
              
              {/* Eyes - change based on mood */}
              {catMood === 'worried' ? (
                <>
                  <ellipse cx="85" cy="85" rx="8" ry="12" fill="#2c1810"/>
                  <ellipse cx="115" cy="85" rx="8" ry="12" fill="#2c1810"/>
                  <ellipse cx="85" cy="83" rx="3" ry="4" fill="#fff"/>
                  <ellipse cx="115" cy="83" rx="3" ry="4" fill="#fff"/>
                </>
              ) : (
                <>
                  <circle cx="85" cy="85" r="8" fill="#2c1810"/>
                  <circle cx="115" cy="85" r="8" fill="#2c1810"/>
                  <circle cx="87" cy="83" r="3" fill="#fff"/>
                  <circle cx="117" cy="83" r="3" fill="#fff"/>
                </>
              )}
              
              {/* Blush */}
              <circle cx="70" cy="95" r="8" fill="#ffb6c1" opacity="0.6"/>
              <circle cx="130" cy="95" r="8" fill="#ffb6c1" opacity="0.6"/>
              
              {/* Mouth */}
              {catMood === 'worried' ? (
                <path d="M 90 105 Q 100 100 110 105" stroke="#2c1810" strokeWidth="3" fill="none" strokeLinecap="round"/>
              ) : (
                <path d="M 90 100 Q 100 105 110 100" stroke="#2c1810" strokeWidth="3" fill="none" strokeLinecap="round"/>
              )}
              
              {/* Nose */}
              <path d="M 100 95 L 95 100 L 105 100 Z" fill="#2c1810"/>
              
              {/* Whiskers */}
              <line x1="60" y1="92" x2="40" y2="90" stroke="#2c1810" strokeWidth="2"/>
              <line x1="60" y1="98" x2="40" y2="100" stroke="#2c1810" strokeWidth="2"/>
              <line x1="140" y1="92" x2="160" y2="90" stroke="#2c1810" strokeWidth="2"/>
              <line x1="140" y1="98" x2="160" y2="100" stroke="#2c1810" strokeWidth="2"/>
              
              {/* Arms */}
              <ellipse cx="65" cy="125" rx="10" ry="25" fill="#fff" stroke="#2c1810" strokeWidth="3"/>
              <ellipse cx="135" cy="125" rx="10" ry="25" fill="#fff" stroke="#2c1810" strokeWidth="3"/>
            </g>
          </svg>
        </div>

        <h1 className="question">Will you be my Valentine?</h1>
        
        <div className="buttons-container">
          <button className="yes-button" onClick={handleYesClick}>
            Yes
          </button>
          <button 
            className="no-button"
            onMouseEnter={handleNoHover}
            onClick={handleNoClick}
            style={{
              transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
            }}
          >
            No
          </button>
        </div>

        {noHoverCount > 3 && (
          <p className="hint">The "No" button seems to be running away... 🤔</p>
        )}
      </div>
    </div>
  );
}

export default App;
