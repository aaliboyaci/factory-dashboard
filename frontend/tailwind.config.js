export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        running: '#16a34a',
        idle: '#f59e0b',
        down: '#ef4444',
        maintenance: '#6366f1'
      }
    }
  },
  plugins: []
}
