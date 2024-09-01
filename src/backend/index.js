const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const superadminRouter = require('./routes/superadmin');
const authRouter = require('./routes/authRoutes');
const passwordResetRoute = require('./routes/resetpassword');
const adminRoutes = require('./routes/adminRoutes');
const adminHistoryRoutes = require('./routes/adminHistoryRoutes');
const productRoutes = require('./routes/productRoutes');
const productHistory = require ('./routes/productHistory');
const path = require('path'); 


const app = express();

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: 'GET,POST,PUT,DELETE, PATCH,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));
app.use('/superadmin', superadminRouter);
app.use('/api', authRouter);
app.use('/reset-password', passwordResetRoute);
app.use('/admin', adminRoutes);
app.use('/history', adminHistoryRoutes);
app.use('/produit', productRoutes);
app.use('/producthistory', productHistory);

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.options('*', cors());

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});