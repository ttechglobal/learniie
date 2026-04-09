/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/lib/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand:        '#0D5C2E',
        brandDark:    '#093D1E',
        brandLight:   '#E8F5EE',
        amber:        '#F5A623',
        amberDark:    '#C4851A',
        amberLight:   '#FFF5E0',
        coral:        '#F04E37',
        indigo:       '#4A3ADB',
        cream:        '#F9F6F0',
        surface:      '#FFFFFF',
        surface2:     '#F3EFE8',
        border:       '#E8E0D4',
        borderStrong: '#C8BFB0',
        ink:          '#1A1209',
        inkMid:       '#5C4F3A',
        inkLight:     '#9A8C78',
        notStarted:   '#EF4444',
        beginning:    '#F97316',
        getting:      '#F59E0B',
        onTrack:      '#84CC16',
        ready:        '#22C55E',
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body:    ['Nunito', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card:  '0 2px 8px rgba(26,18,9,0.06), 0 0 0 1px rgba(26,18,9,0.04)',
        lift:  '0 8px 24px rgba(26,18,9,0.10)',
        amber: '0 4px 16px rgba(245,166,35,0.35)',
        brand: '0 4px 16px rgba(13,92,46,0.30)',
      },
    },
  },
  plugins: [],
}