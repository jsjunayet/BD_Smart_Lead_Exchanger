"use client";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/services/authService";
import { Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getCurrentUser();
      setUser(session);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    // await logoutUser();
    await logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                LX
              </span>
            </div>
            <span className="font-bold text-xl text-foreground">
              BDSmartLeadX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/marketing"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Marketing Tools
            </Link>
            <Link
              href="/workplace"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Work Place
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {!user ? (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <User className="w-4 h-4" />
                  <span>{user.name || user.email}</span>
                </Button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                    <Link
                      href={
                        user.role === "admin" || user.role === "superAdmin"
                          ? "/admin/dashboard"
                          : "/user/dashboard"
                      }
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/marketing"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Marketing Tools
              </Link>
              <Link
                href="/workplace"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Work Place
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </Link>

              {!user ? (
                <div className="flex space-x-4 pt-4">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4">
                  <Link
                    href={
                      user.role === "admin" || user.role === "superAdmin"
                        ? "/admin/dashboard"
                        : "/user/dashboard"
                    }
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
