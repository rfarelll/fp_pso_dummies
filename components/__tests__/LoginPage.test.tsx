import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/app/login/page'
import '@testing-library/jest-dom'
import { signInWithEmailAndPassword } from "firebase/auth"

// Mock next/image
jest.mock("next/image", () => {
  const NextImage = (props: React.ComponentProps<'img'>) => <img {...props} />;
  NextImage.displayName = "NextImage";
  return NextImage;
});

// Mock next/link
jest.mock("next/link", () => {
  function NextLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  }
  NextLink.displayName = "NextLink";
  return NextLink;
});

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

beforeEach(() => {
  jest.clearAllMocks();
  // @ts-expect-error: mocking window.location in Jest test
  delete window.location;
  // @ts-expect-error: mocking window.location in Jest test
  window.location = { href: "" };
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

  it("can type email and password", () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.change(passInput, { target: { value: "12345678" } });

    expect(emailInput).toHaveValue("test@mail.com");
    expect(passInput).toHaveValue("12345678");
  });

  it("calls signInWithEmailAndPassword with correct args and redirects on success", async () => {
    mockSignIn.mockResolvedValueOnce({ user: { uid: "uid123" } });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "tes@mail.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "abcdefg" } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(expect.anything(), "tes@mail.com", "abcdefg");
      expect(window.location.href).toBe("/home");
    });
  });

  it("shows alert on login failure", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("Login failed"));
    window.alert = jest.fn();

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "fail@mail.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Login failed");
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

    // Selesaikan promise biar ga "pending" terus
    resolvePromise!();
  });
