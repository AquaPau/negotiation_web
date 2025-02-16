module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/prop-types": "off", // Disable prop-types as we're not using them in this project
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
  },
  settings: {
    react: {
      version: "detect",
    },
  },
}
