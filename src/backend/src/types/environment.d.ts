declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        PORT: string;
        MONGODB_URI: string;
        MONGODB_TEST_URI: string;
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
        API_PREFIX: string;
        CORS_ORIGIN: string;
      }
    }
  }
  
  export {};