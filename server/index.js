const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true
}));

// Handle preflight requests for all routes
app.options('*', cors());

app.use(express.json());
app.use(helmet());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const employeeRoutes = require('./routes/employeeRoute');
app.use('/api/employees', employeeRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'keys', 'privatekey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'keys', 'certificate.pem'))
};

https.createServer(sslOptions, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(8080, () => {
  console.log('HTTP Server running on port 80 and redirecting to HTTPS');
});
