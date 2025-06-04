import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import '@testing-library/jest-dom';
import { signInWithEmailAndPassword } from "firebase/auth";

// --- Mock next/image ---
jest.mock("next/image", () => {
  const NextImage = (props: React.ComponentProps<'img'>) => <img {...props} />;
  NextImage.displayName = "NextImage";
  return NextImage;
});
// --- Mock next/link ---
jest.mock("next/link", () => {
  function NextLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  }
  NextLink.displayName = "NextLink";
  return NextLink;
});

// --- Mock Firebase ---
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => ({})),
}));
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
}));
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(() => ({})),
}));

const mockSignIn = signInWithEmailAndPassword as jest.Mock;

// --- SPY window.location.assign ---
beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: { assign: jest.fn() },
    writable: true,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  (window.location.assign as jest.Mock).mockClear();
});

it("renders all input fields, button, and register link", () => {
  render(<LoginPage />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '/register');
});

it("calls signInWithEmailAndPassword with correct args and redirects on success", async () => {
  mockSignIn.mockResolvedValueOnce({ user: { uid: "uid123" } });
  render(<LoginPage />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "tes@mail.com" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "abcdefg" } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(mockSignIn).toHaveBeenCalledWith(expect.anything(), "tes@mail.com", "abcdefg");
    expect(window.location.assign).toHaveBeenCalledWith("/home");
  });
});

it("shows loading state when submitting", async () => {
  let resolvePromise: () => void;
  const fakePromise = new Promise<void>((res) => { resolvePromise = res; });
  mockSignIn.mockImplementation(() => fakePromise);

  render(<LoginPage />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@mail.com" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "mypassword" } });

  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();

  // Selesaikan promise agar loading selesai
  resolvePromise!();
});
