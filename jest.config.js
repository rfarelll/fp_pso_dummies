module.exports = {
  preset: "ts-jest", // atau bisa dihapus kalau sudah pakai babel-jest
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // Mock file static jika butuh
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  // Supaya semua node_modules tetap ignore kecuali @/ dan node_modules/@testing-library (optional)
  transformIgnorePatterns: [
    "node_modules/(?!(@testing-library|@fortawesome)/)"
  ],
};
