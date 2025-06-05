import { render, screen } from '@testing-library/react'
import LandingPage from '@/components/LandingPage'
import '@testing-library/jest-dom'

// Mock next/image with typing & displayName
jest.mock("next/image", () => {
  const MockedImage = (props: React.ComponentProps<'img'>) => <img {...props} />;
  MockedImage.displayName = 'NextImage';
  return MockedImage;
});

// Mock next/link as a named function with displayName
jest.mock("next/link", () => {
  function NextLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  }
  NextLink.displayName = "NextLink";
  return NextLink;
});

describe('LandingPage', () => {
  it('renders main title and tagline', () => {
    render(<LandingPage />)
    expect(screen.getByRole('heading', { name: /dooIT/i })).toBeInTheDocument()
    expect(screen.getByText(/Konversi Kurs & Kelola Saldo Mata Uang/i)).toBeInTheDocument()
  })

  it('renders DooIT logo', () => {
    render(<LandingPage />)
    expect(screen.getByAltText(/DooIT Logo/i)).toBeInTheDocument()
  })

  it('renders Sign Up and Log In buttons with correct links', () => {
    render(<LandingPage />)
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/register')
    expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute('href', '/login')
  })

  it('renders description paragraph', () => {
    render(<LandingPage />)
    expect(screen.getByText(/DooIT adalah aplikasi web sederhana/i)).toBeInTheDocument()
  })
})
