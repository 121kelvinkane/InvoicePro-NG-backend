const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const env = require('./config/env');
const routes = require('./routes');
const authRoutes = require('./routes/auth.routes');
const customerRoutes = require('./routes/customer.routes'); // <-- Added Customer Routes

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientOrigin === '*'
      ? true
      : env.clientOrigin.split(',').map((origin) => origin.trim()),
    credentials: true
  })
);

app.use(express.json());

app.use('/api/v1', routes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes); // <-- Connected Customer Routes
app.use('/api/v1/profiles', profileRoutes); profileRoutes

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

module.exports = app;
