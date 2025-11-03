const corsOptions = {
  origin: ["http://localhost:5173", "https://tu-frontend.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;