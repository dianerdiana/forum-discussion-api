/* istanbul ignore file */
import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.test.env'),
  });
} else {
  dotenv.config();
}

const config = {
  app: {
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
    debug: process.env.NODE_ENV === 'development' ? { request: ['error'] } : {},
  },
  database: {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'forum_api',
  },
  auth: {
    jwtStrategy: 'forumapi',
    accessTokenKey: process.env.ACCESS_TOKEN_KEY || 'ACCESS_TOKEN_KEY',
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY || 'REFRESH_TOKEN_KEY',
    accessTokenAge: process.env.ACCESS_TOKEN_AGE || 3000,
  },
};

export default config;
