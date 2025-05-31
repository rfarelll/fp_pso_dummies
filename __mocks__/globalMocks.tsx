/* eslint-disable react/display-name, @next/next/no-img-element */
const React = require('react');

jest.mock('next/image', () => (props) => React.createElement('img', props));
jest.mock('next/link', () => (props) => React.createElement('a', props));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((auth, cb) => cb(null)),
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/lib/firebaseConfig', () => ({
  auth: {},
}));
