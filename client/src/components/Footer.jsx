import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-24 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Section */}
          <div className="space-y-8">
            <Link to="/" className="text-3xl font-bold tracking-tight text-white font-display">
              Areva
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Experience the pinnacle of luxury and comfort. Our curated collection of world-class hotels ensures an unforgettable sanctuary for the sophisticated traveler.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gold hover:bg-gold hover:text-dark transition-all duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-12">
            <h4 className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Rooms', 'Contact'].map((link) => (
                <li key={link}>
                  <Link to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="text-sm text-gray-400 hover:text-white hover:pl-2 transition-all duration-300">
                    {link.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-8">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <svg className="w-5 h-5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <p className="text-sm text-gray-400 leading-relaxed">
                  123 Luxury Way, Suite 456<br />
                  Beverly Hills, CA 90210
                </p>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-5 h-5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <p className="text-sm text-gray-400 font-medium">+1 (555)Luxury-Stay</p>
              </li>
              <li className="flex items-center gap-4">
                <svg className="w-5 h-5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <p className="text-sm text-gray-400 font-medium">concierge@areva.com</p>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="bg-gray-800/50 p-8 rounded-3xl border border-gray-700/50">
            <h4 className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">Newsletter</h4>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed">
              Stay updated with the latest luxury offers and destination guides.
            </p>
            <form className="space-y-4">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="w-full bg-dark border border-gray-700 px-4 py-3 text-[10px] font-bold tracking-widest text-white outline-none focus:border-gold transition-colors"
              />
              <button className="w-full bg-gold text-dark py-3 text-[10px] font-bold tracking-widest hover:bg-white transition-all duration-300 shadow-lg shadow-gold/10">
                SUBSCRIBE
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500 font-medium">
            &copy; {currentYear} AREVA HOTELS & RESORTS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-gray-500 hover:text-gold font-medium">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gold font-medium">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
