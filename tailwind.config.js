const konstaConfig = require('konsta/config');

// wrap your config with konstaConfig
module.exports = konstaConfig({
    darkMode: 'selector',
  // rest of your usual Tailwind CSS config here
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
});
