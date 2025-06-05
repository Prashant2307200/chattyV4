import "dotenv/config";

const {
  PORT,
  NODE_ENV,
  REDIS_HOST,
  REDIS_PORT,
  MONGO_URI,
  REDIS_URI,
  COOKIE_SECRET,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  GEMINI_API_KEY
} = process.env;

export const AppConfig = {

  env: {

    PORT: Number(PORT) || 8080,
    NODE_ENV: NODE_ENV || "development",

    REDIS_HOST: REDIS_HOST || "redis",
    REDIS_PORT: Number(REDIS_PORT) || 6379,
    REDIS_URI: REDIS_URI || `redis://redis:6379`,

    MONGO_URI: MONGO_URI || "mongodb://127.0.0.1:27017/chatty",

    COOKIE_SECRET: COOKIE_SECRET || "cookie_secret",
    ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET || "access_token_secret",
    REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET || "refresh_token_secret",

    CLOUD_NAME,
    CLOUD_API_KEY,
    CLOUD_API_SECRET,

    GEMINI_API_KEY,

    ORIGIN_URL: process.env.ORIGIN_URL || "http://localhost:5173",
  },

  Paths: {
    Auth: {
      Base: "/auth",
      Login: "/login",
      Register: "/register",
      Check: "/check",
      ProfileUpdate: "/profile-update",
      Logout: "/logout",
    },
    Users: {
      Base: "/users",
      Search: "/",
    },
    Chats: {
      Base: "/chats",
      GetChats: "/",
      GetChatMessages: "/:id",
      CreateGroup: "/group",
      CreateMessage: "/:id/messages",
    },
    Requests: {
      Base: "/requests",
      Get: "/",
      Create: "/",
      Cancel: "/:id",
      Update: "/:id",
    },
    Messages: {
      CreateMessage: '/'
    }
  },

  Status: {
    Success: 200,
    Created: 201,
    NoContent: 204,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    Conflict: 409,
    TooManyRequests: 429,
    InternalServerError: 500
  },

  corsConfig: {
    origin: NODE_ENV === "production" ? (process.env.ORIGIN_URL || '/') : "http://localhost:5173",
    credentials: true,  // allow cookie
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 3600  // cache to avoid preflight
  },

  compressionConfig: {
    level: 6,
    threshold: 1 / 2 * 1024,  // skip tiny message payloads 
  },

  cookieOptions: {
    httpOnly: true,  // xss: Prevents cross-site scripting attacks via client side JavaScript
    secure: NODE_ENV === "production",  // cookie only sent over https
    sameSite: "lax",  // csrf: Prevents cross-site request forgery attacks
    signed: true,  // tamper-proof cookie
    maxAge: 1000 * 60 * 60 * 24 * 7  // expires in 7 days
  },

  helmetConfig: {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:", "blob:", "https://randomuser.me", "https://images.pexels.com", "https://i.pinimg.com", "https://th.bing.com"],
        "font-src": ["'self'", "https:", "data:"],
        "connect-src": [
          "'self'",
          "ws:",
          "wss:",
          "https:",
          "http://localhost:5173",
          "https://th.bing.com",
          "https://images.pexels.com",
          "https://i.pinimg.com"
        ],
        "manifest-src": ["'self'"],
        "frame-src": ["'self'"],
        "worker-src": ["'self'", "blob:"],
      },
    },
  },

  rateLimitConfig: {
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    message: 'Too many requests from this IP, please try again later',
    filter: (request) => request.originalUrl.startsWith('/api/v1'),
  },

  jsonParseConfig: {
    limit: "10mb",
    // extended: true, 
  },

  urlencodedConfig: {
    limit: "10mb",
    // extended: true,
  },
}