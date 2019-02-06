//
// Set the database connection variables depending on environment.
//
exports.settings = {
  host: `129.213.43.229`,
  user: `root`,
  password: process.env.DB_PW,
  port: 3306,
  database: `mydatabase`
};