import { keyframes } from '@emotion/react';

export const scrollBarCSS = {
  '&::-webkit-scrollbar': {
    background: 'rgba(255,255,255,0.25)',
    width: '3.5px',
  },
  '&::-webkit-scrollbar-track': {
    width: '2.5px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(50,201,247,1)',
  },
};

export const boxShadowAnimation = keyframes`
0% { box-shadow: 0 0 5px rgba(255,255,255,0); }
25% { box-shadow: 0 0 10px rgba(255,255,255,0.5); }
50% { box-shadow: 0 0 15px rgba(255,255,255,0.75); }
75% { box-shadow: 0 0 10px rgba(255,255,255,0.5); }
100% { box-shadow: 0 0 5px rgba(7,232,216,0); }
`;

export const orangeBoxShadowAnimation = keyframes`
0% { box-shadow: 0 0 5px rgba(255, 168, 0, 0); }
25% { box-shadow: 0 0 10px rgba(255, 168, 0,0.5); }
50% { box-shadow: 0 0 15px rgba(255, 168, 0,0.75); }
75% { box-shadow: 0 0 10px rgba(255, 168, 0,0.5); }
100% { box-shadow: 0 0 5px rgba(7,232,216,0); }
`;
