'use client';

import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import './TextType.css';

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  startOnVisible = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const showCloud = true; 
  const cursorRef = useRef(null);
  const containerRef = useRef(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return '#ffffff';
    return textColors[0];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      const blinkAnimation = () => {
        if (cursorRef.current) {
          cursorRef.current.style.opacity = cursorRef.current.style.opacity === '0' ? '1' : '0';
        }
      };
      
      const interval = setInterval(blinkAnimation, cursorBlinkDuration * 1000);
      return () => clearInterval(interval);
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
    }, initialDelay);

    return () => clearTimeout(typingTimeout);
  }, [initialDelay]);

  useEffect(() => {
    if (!isVisible) return;

    let timeout;
    const allText = textArray.join(' ');

    const executeTypingAnimation = () => {
      if (currentCharIndex < allText.length) {
        timeout = setTimeout(
          () => {
            setDisplayedText(prev => prev + allText[currentCharIndex]);
            setCurrentCharIndex(prev => prev + 1);
          },
          variableSpeed ? getRandomSpeed() : typingSpeed
        );
      }
    };

    if (currentCharIndex === 0 && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay + 1500);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    typingSpeed,
    textArray,
    initialDelay,
    isVisible,
    variableSpeed,
    getRandomSpeed
  ]);

  const shouldHideCursor = hideCursorWhileTyping && currentCharIndex < textArray.join(' ').length;

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props
    },
    showCloud && (
      <div className="text-cloud">
        <div className="cloud-bubble">
          {displayedText ? (
            <span className="text-type__content" style={{ color: getCurrentTextColor() }}>
              {displayedText}
              {showCursor && (
                <span
                  ref={cursorRef}
                  className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
                >
                  {cursorCharacter}
                </span>
              )}
            </span>
          ) : (
            <div className="cloud-dots">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default TextType;
