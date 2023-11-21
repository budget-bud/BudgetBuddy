/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary_100: "#003366",
        primary_200: "#004080",
        primary_300: "#004d99",
        primary_400: "#0059b3",
        primary_500: "#0066cc",
        primary_600: "#0073e6",
        primary_700: "#0080ff",
        primary_800: "#1a8cff",
        primary_900: "#33adff",

        secondary_100: "#50AAFF",
        secondary_200: "#66b3ff",
        secondary_300: "#80bfff",
        secondary_400: "#99ccff",
        secondary_500: "#b3d9ff",
        secondary_600: "#cce6ff",
        secondary_700: "#e6f2ff",
        secondary_800: "#f2f9ff",
        secondary_900: "#ffffff",

        tertiary_900: "#F1F1E6",
        tertiary_800: "#EDEDD3",
        tertiary_700: "#E9E9BF",
        tertiary_600: "#E5E5AA",
        tertiary_500: "#E1E195",
        tertiary_400: "#DDDD80",
        tertiary_300: "#D9D96B",
        tertiary_200: "#D5D556",
        tertiary_100: "#D1D141",

        success_100: "#00ff00",
        success_200: "#4dff4d",
        success_300: "#80ff80",

        warning_100: "#ffff00",
        warning_200: "#ffff4d",
        warning_300: "#ffff80",
        
        error_100: "#ff0000",
        error_200: "#ff4d4d",
        error_300: "#ff8080",
        error_400: "#ff9999",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
      },
    },
  },
  plugins: [],
};
