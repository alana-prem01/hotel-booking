const About = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-dark py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80" className="w-full h-full object-cover" alt="Luxury Hotel" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <span className="text-gold text-xs font-bold tracking-[0.5em] uppercase mb-4 block">Since 2008</span>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 font-display uppercase tracking-widest leading-tight">
            Redefining <br /> Luxury Hospitality
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" className="rounded-3xl shadow-2xl relative z-10" alt="Hotel View" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl -z-10"></div>
          </div>
          <div className="space-y-8">
            <h2 className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Our Story</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-dark font-display leading-tight">
              A Legacy of <br /> Excellence.
            </h3>
            <p className="text-gray-500 leading-relaxed">
              At Areva, we believe that travel is more than just reaching a destination; it's about the experiences that shape us. Our journey began with a vision to create a space where luxury meets comfort, and every guest is treated like royalty.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Today, with over 15 years of excellence, we continue to set new standards in hospitality, offering unparalleled service and world-class amenities in the world's most beautiful locations.
            </p>
            <div className="grid grid-cols-2 gap-10 pt-8">
              <div>
                <span className="text-4xl font-bold text-dark block mb-2">150+</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Luxury Suites</span>
              </div>
              <div>
                <span className="text-4xl font-bold text-dark block mb-2">25k+</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Happy Guests</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4 font-display uppercase tracking-widest text-center">Our Core Values</h2>
            <div className="w-20 h-1 bg-gold mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'Excellence', desc: 'We strive for perfection in everything we do, from the smallest detail to the grandest experience.' },
              { title: 'Integrity', desc: 'Honesty and transparency are the foundations of our relationships with guests and partners.' },
              { title: 'Innovation', desc: 'We constantly evolve to provide state-of-the-art facilities and modern luxury services.' }
            ].map((v, i) => (
              <div key={i} className="bg-white p-12 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gold transition-colors">
                  <span className="text-gold group-hover:text-white font-bold">0{i+1}</span>
                </div>
                <h4 className="text-xl font-bold text-dark mb-4 font-display tracking-widest uppercase">{v.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
