module.exports = {
  // App Settings
  database: process.env.MONGO_URI || 'mongodb://localhost/phaino_db',
  port: process.env.PORT || 3000,
  protocol: process.env.PROTOCOL || 'http',
  host: process.env.HOST || 'localhost'
};
