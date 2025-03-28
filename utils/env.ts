import dotenv from 'dotenv';
dotenv.config();

export const getHudlCredentials = () => {
  const email = process.env.HUDL_EMAIL;
  const password = process.env.HUDL_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing HUDL credentials in .env file.');
  }

  return { email, password };
};
