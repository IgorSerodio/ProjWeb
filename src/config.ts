import dotenv from 'dotenv';

dotenv.config();

const config = {
   jwtSecretKey : process.env.JWT_SECRET_KEY || "minha_chave_secreta",
   serverPort : process.env.PORT || 3000
};

export default config;