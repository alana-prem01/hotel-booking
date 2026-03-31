const Contact = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-dark py-24 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 font-display uppercase tracking-[0.2em]">Contact Us</h1>
        <div className="w-24 h-1 bg-gold mx-auto"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Info Section */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xs font-bold tracking-[0.3em] text-gold uppercase mb-6">Get In Touch</h2>
              <h3 className="text-4xl lg:text-5xl font-bold text-dark font-display leading-[1.1]">
                We're here to <br /> assist you.
              </h3>
            </div>

            <div className="space-y-8">
              {[
                { label: 'Our Location', line1: '123 Luxury Avenue, Beverly Hills', line2: 'California, US', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
                { label: 'Contact Details', line1: '+1 (555) 123-4567', line2: 'reservations@areva.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { label: 'Opening Hours', line1: 'Monday - Friday: 09:00 - 21:00', line2: 'Saturday - Sunday: 10:00 - 18:00', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-gray-100">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">{item.label}</h4>
                    <p className="text-dark font-bold text-sm tracking-wide">{item.line1}</p>
                    <p className="text-gray-500 text-sm">{item.line2}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-gray-50 rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-dark font-display mb-8 uppercase tracking-widest">Send a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Your Name</label>
                  <input type="text" className="w-full bg-white border-none rounded-xl p-4 text-sm font-medium outline-none focus:ring-1 focus:ring-gold" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                  <input type="email" className="w-full bg-white border-none rounded-xl p-4 text-sm font-medium outline-none focus:ring-1 focus:ring-gold" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Subject</label>
                <input type="text" className="w-full bg-white border-none rounded-xl p-4 text-sm font-medium outline-none focus:ring-1 focus:ring-gold" placeholder="Room Reservation Question" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Your Message</label>
                <textarea rows="5" className="w-full bg-white border-none rounded-xl p-4 text-sm font-medium outline-none focus:ring-1 focus:ring-gold" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-dark text-white text-[10px] font-bold tracking-[0.3em] uppercase rounded-xl hover:bg-gold transition-all duration-300 shadow-xl shadow-dark/10">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="h-[500px] bg-gray-100 flex items-center justify-center relative overflow-hidden group">
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80" className="w-full h-full object-cover" alt="Map View" />
        <div className="absolute inset-0 bg-dark/20 group-hover:bg-dark/0 transition-all duration-700"></div>
        <div className="absolute bg-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold tracking-widest text-dark uppercase">Our Flagship Location</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
