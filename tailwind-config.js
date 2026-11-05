/* Tailwind (CDN) theme. Edit colours here and they update every page. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        burgundy: { DEFAULT: '#7A1428', bright: '#B02A47', deep: '#2A0710' },
        silver: { DEFAULT: '#C9CCD3', dim: '#8E939C', light: '#EEF0F4' }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Instrument Sans', 'system-ui', 'sans-serif']
      }
    }
  }
};