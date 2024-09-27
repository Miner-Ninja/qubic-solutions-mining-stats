import React, { useEffect, useRef } from 'react';

const HoneycombBackground = () => {
  const honeycombRef = useRef(null);

  useEffect(() => {
    const cellWidth = 45;
    const cellHeight = 50;
    const rowHeight = cellHeight * 3/4;

    const createHoneycomb = () => {
      const honeycomb = honeycombRef.current;
      if (!honeycomb) return;

      const columns = Math.ceil(window.innerWidth / cellWidth) + 1;
      const rows = Math.ceil(window.innerHeight / rowHeight) + 1;

      honeycomb.innerHTML = '';

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const cell = document.createElement('div');
          cell.classList.add('honeycomb-cell');
          cell.style.left = `${col * cellWidth + (row % 2) * (cellWidth / 2)}px`;
          cell.style.top = `${row * rowHeight}px`;
          cell.style.opacity = '0';
          honeycomb.appendChild(cell);
        }
      }
    };

    const animateHoneycomb = () => {
      const cells = honeycombRef.current.querySelectorAll('.honeycomb-cell');
      cells.forEach(cell => {
        if (Math.random() < 0.01) {
          cell.style.opacity = '1';
          setTimeout(() => {
            cell.style.opacity = '0';
          }, 2000);
        }
      });
    };

    createHoneycomb();
    window.addEventListener('resize', createHoneycomb);
    const animationInterval = setInterval(animateHoneycomb, 50);

    return () => {
      window.removeEventListener('resize', createHoneycomb);
      clearInterval(animationInterval);
    };
  }, []);

  return <div ref={honeycombRef} className="honeycomb" />;
};

export default HoneycombBackground;
