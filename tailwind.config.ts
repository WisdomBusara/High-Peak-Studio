import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F3EE',
        surface: '#EAE7DF',
        text: '#151515',
        muted: '#686762',
        border: '#C9C6BD',
        dark: '#111111',
        light: '#F7F6F2',
        // Accent: the red-brown of Kenyan laterite soil
        laterite: {
          DEFAULT: '#8E4A2F',
          light: '#EFE3DC',
          deep: '#5E2E1B',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        gutter: 'var(--gutter)',
      },
      gridTemplateColumns: {
        desktop: 'repeat(12, 1fr)',
        tablet: 'repeat(8, 1fr)',
        mobile: 'repeat(4, 1fr)',
      },
    },
  },
  plugins: [],
}

export default config
