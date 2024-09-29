import React, { useEffect, useRef, useState } from 'react';

const HexagonBackground = ({
  hexagonWidth = 45,
  hexagonHeight = 50,
  hexagonColor = '#230d42',
  strokeColor = '#2f1a4d',
  strokeWidth = 2,
  fadeInSpeed = 1.0,
  fadeOutSpeed = 1.0
}) => {
  const svgRef = useRef(null);
  const [hexagons, setHexagons] = useState([]);

  useEffect(() => {
    const rowHeight = hexagonHeight * 3/4;

    const createHexagonGrid = () => {
      const svg = svgRef.current;
      if (!svg) return;

      const columns = Math.ceil(window.innerWidth / hexagonWidth) + 1;
      const rows = Math.ceil(window.innerHeight / rowHeight) + 1;

      const newHexagons = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const x = col * hexagonWidth + (row % 2) * (hexagonWidth / 2);
          const y = row * rowHeight;
          newHexagons.push({ id: `hexagon-${row}-${col}`, x, y });
        }
      }

      setHexagons(newHexagons);
    };

    createHexagonGrid();
    window.addEventListener('resize', createHexagonGrid);

    return () => {
      window.removeEventListener('resize', createHexagonGrid);
    };
  }, [hexagonWidth, hexagonHeight]);

  useEffect(() => {
    const animateHexagons = () => {
      hexagons.forEach(hexagon => {
        const element = document.getElementById(hexagon.id);
        if (element && Math.random() < 0.01) {
          element.style.transition = `opacity ${fadeInSpeed}s ease-in-out`;
          element.style.opacity = '1';
          setTimeout(() => {
            element.style.transition = `opacity ${fadeOutSpeed}s ease-in-out`;
            element.style.opacity = '0';
          }, 4000);
        }
      });
    };

    const animationInterval = setInterval(animateHexagons, 200);

    return () => {
      clearInterval(animationInterval);
    };
  }, [hexagons, fadeInSpeed, fadeOutSpeed]);

  // Calculate points for the hexagon polygon
  const halfWidth = hexagonWidth / 2;
  const quarterHeight = hexagonHeight / 4;
  const points = `
    ${halfWidth},0
    ${hexagonWidth},${quarterHeight}
    ${hexagonWidth},${3*quarterHeight}
    ${halfWidth},${hexagonHeight}
    0,${3*quarterHeight}
    0,${quarterHeight}
  `;

  return (
    <svg 
      ref={svgRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1 
      }}
    >
      <defs>
        <polygon 
          id="hexagon" 
          points={points}
          fill={hexagonColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </defs>
      {hexagons.map(hexagon => (
        <use 
          key={hexagon.id}
          id={hexagon.id}
          href="#hexagon" 
          x={hexagon.x} 
          y={hexagon.y}
          style={{
            opacity: 0,
          }}
        />
      ))}
    </svg>
  );
};

export default HexagonBackground;