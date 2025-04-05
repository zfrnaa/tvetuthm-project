import { useState, useEffect } from 'react';

export function useCustomFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Create a style element to add font-face declarations
    const style = document.createElement('style');

    // Add @font-face declarations for each font
    style.textContent = `
      @font-face {
        font-family: 'GeistSans';
        src: url('/fonts/GeistSans/Geist-Regular.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'GeistSans';
        src: url('/fonts/GeistSans/Geist-Medium.ttf') format('truetype');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'GeistSans';
        src: url('/fonts/GeistSans/Geist-Bold.ttf') format('truetype');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'GeistMono';
        src: url('/fonts/GeistMono/GeistMono-Light.ttf') format('truetype');
        font-weight: 300;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'GeistMono';
        src: url('/fonts/GeistMono/GeistMono-Regular.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'GeistMono';
        src: url('/fonts/GeistMono/GeistMono-Medium.ttf') format('truetype');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'GeistMono';
        src: url('/fonts/GeistMono/GeistMono-Bold.ttf') format('truetype');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
    `;

    // Append the style to the document head
    document.head.appendChild(style);

    // Use FontFaceObserver or similar to detect when fonts have loaded
    // For simplicity, we'll just set fonts as loaded immediately
    setFontsLoaded(true);

    return () => {
      // Clean up by removing the style element on unmount
      document.head.removeChild(style);
    };
  }, []);

  return fontsLoaded;
}