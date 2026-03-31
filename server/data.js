export const hotelsData = [
  {
    name: "Grand Palace Hotel",
    location: {
      address: "123 Royal Street",
      city: "New York",
      country: "USA",
      state: "NY",
      zipCode: "10001"
    },
    description: "Experience luxury at its finest. This spacious property features premium amenities and elegant furnishing.",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
    amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
    rating: 4.8,
    basePricePerNight: 299
  },
  {
    name: "Ocean View Resort",
    location: {
      address: "456 Beachfront Ave",
      city: "Miami",
      country: "USA",
      state: "FL",
      zipCode: "33139"
    },
    description: "Stunning ocean views and beachfront access. Perfect for a relaxing getaway.",
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"],
    amenities: ["WiFi", "Beach Access", "Pool", "Bar"],
    rating: 4.6,
    basePricePerNight: 199
  },
  {
    name: "Mountain Lodge Retreat",
    location: {
      address: "789 Pine Valley Road",
      city: "Aspen",
      country: "USA",
      state: "CO",
      zipCode: "81611"
    },
    description: "A cozy retreat in the heart of the mountains. Ideal for skiing and nature lovers.",
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"],
    amenities: ["WiFi", "Fireplace", "Ski Access", "Restaurant"],
    rating: 4.7,
    basePricePerNight: 349
  }
];

export const roomsData = [
  {
    hotelName: "Grand Palace Hotel",
    type: "Deluxe Suite",
    price: 450,
    description: "Spacious suite with premium amenities and stunning views.",
    capacity: 2,
    quantity: 10,
    amenities: ["Ocean View", "Balcony", "Mini Bar"],
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304"]
  },
  {
    hotelName: "Ocean View Resort",
    type: "Executive Room",
    price: 350,
    description: "Elegant room with modern design and comfort.",
    capacity: 2,
    quantity: 15,
    amenities: ["City View", "Work Desk", "Premium WiFi"],
    images: ["https://images.unsplash.com/photo-1595576508898-0ad5c879a061"]
  }
];
