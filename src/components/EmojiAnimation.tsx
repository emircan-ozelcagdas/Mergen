import React from 'react';
import './EmojiAnimation.css';

interface EmojiAnimationProps {
  emojis: string[];
}

const EmojiAnimation: React.FC<EmojiAnimationProps> = ({ emojis }) => {
  return (
    <div className="emoji-animation-container">
      {emojis.map((emoji, index) => (
        <span
          key={index}
          className="emoji"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 2 + 1}rem`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default EmojiAnimation;
