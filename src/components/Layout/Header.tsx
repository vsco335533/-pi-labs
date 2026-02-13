import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Home,
  FileText,
  Video,
  Image,
  LayoutDashboard,
  MoreVertical,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import logo from "../../assets/image (1-).png";

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/research", icon: FileText, label: "Research" },
    { to: "/videos", icon: Video, label: "Videos" },
    { to: "/gallery", icon: Image, label: "Gallery" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16 md:h-20 pt-1">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-5 shrink-0" aria-label="Pi Labs Home">
            <img
              src={logo}
              alt="Pi LABS — Commons Research Foundation"
              className="h-12 md:h-16 w-auto object-contain"
              draggable="false"
            />
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-600 font-medium whitespace-nowrap"
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* AUTH & MOBILE MENU TOGGLE */}
          <div className="flex items-center gap-2 md:gap-4 relative">
            {user ? (
              <>
                {/* ROLE BADGE - Hidden on extra small screens */}
                {profile?.role && (
                  <span className={`hidden sm:inline-block text-xs font-semibold px-2 py-1 rounded-full ${profile.role === 'super_admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {profile.role === 'super_admin' ? 'Admin' : 'Researcher'}
                  </span>
                )}
                {/* KEBAB MENU BUTTON */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-700" />
                </button>

                {/* DROPDOWN MENU (USER) */}
                {menuOpen && (
                  <div className="absolute right-0 top-14 w-44 bg-white border rounded-lg shadow-lg z-50 py-2">
                    <Link
                      to="/dasboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>

                    {profile?.role === "super_admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="h-px bg-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        handleSignOut();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <a
                href="https://lms.pilabs.cc/"
                className="hidden md:flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </a>
            )}

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg md:hidden text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        {/* MOBILE NAVIGATION OVERLAY */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-white animate-in md:hidden overflow-y-auto">
            {/* MOBILE MENU HEADER */}
            <div className="flex justify-between items-center h-20 px-4 border-b border-gray-100">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Pi Labs"
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
                aria-label="Close Menu"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* MOBILE MENU LINKS */}
            <div className="px-6 py-10 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors py-2"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl">
                      <link.icon className="w-6 h-6" />
                    </div>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* MOBILE AUTH/USER INFO */}
              <div className="mt-4 border-t border-gray-100 pt-10">
                {user ? (
                  <div className="flex flex-col gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Account</p>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{profile?.full_name}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{profile?.role?.replace('_', ' ')}</p>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                    >
                      <User className="w-5 h-5" />
                      My Dashboard
                    </Link>

                    {profile?.role === "super_admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-3 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:bg-gray-800 transition-all"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-3 w-full py-4 bg-white border-2 border-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <p className="text-gray-500 mb-2">Sign in to access your dashboard and manage research publications.</p>
                    <a
                      href="https://lms.pilabs.cc/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-3 w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <User className="w-5 h-5" />
                      Sign In Now
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}