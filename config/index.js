require('dotenv').config();

module.exports={
    DATABASE_URI:process.env.DATABASE_URI,
    PORT:process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET
}