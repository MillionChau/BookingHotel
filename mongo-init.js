db.createUser({
  user: 'booking_user',
  pwd: 'booking_password',
  roles: [
    {
      role: 'readWrite',
      db: 'booking'
    }
  ]
});

db = db.getSiblingDB('booking');

// Tạo collections và indexes
db.createCollection('users');
db.createCollection('bookings');
db.createCollection('rooms');

db.users.createIndex({ "email": 1 }, { unique: true });
db.rooms.createIndex({ "roomNumber": 1 }, { unique: true });
db.bookings.createIndex({ "checkInDate": 1, "checkOutDate": 1 });