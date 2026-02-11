import { Link } from "react-router-dom";
// import { BookOpen } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-white mb-4">
              <span className="text-xl font-bold">Pi Labs - Commons Research Foundation</span>
            </div>
            <p className="text-gray-400 max-w-md">
              A professional platform for publishing and sharing research, field studies, and knowledge with the world.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/research" className="hover:text-white transition-colors">Research</Link></li>
              <li><Link to="/videos" className="hover:text-white transition-colors">Videos</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">
              For inquiries and collaborations, please reach out through our <Link to="/contact" className="underline hover:text-white transition-colors">contact form</Link>.
            </p>
            <p className="text-gray-400 text-sm mt-3 font-medium">hello@commonscollective.cc</p>
            <p className="text-gray-400 text-sm mt-1">Mithra Hills, Hyder Nagar, Hyderabad, India - 500072</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>
            <span className="copyleft text-lg align-middle">&copy;</span> {currentYear} Pi Labs - Commons Research Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

