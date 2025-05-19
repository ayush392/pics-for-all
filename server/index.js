require("dotenv").config();
const express = require('express');
const dbConnect = require("./db/dbConnect");
const cors = require('cors');

const userRoutes = require('./routes/user.route')
const postRoutes = require('./routes/post.route');
const paymentRoute = require('./routes/payment');
const schedulePingServer = require("./utils/pingServer");

const app = express();

dbConnect();

const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
  };

// middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static('public'))

app.get("/", (req, res) => {
    try {
        res.status(200).json({ statusCode: 200, message: "Server is up and running!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, message: "Internal server error" });
    }
});

//schedulePingServer(); // ping server every 14 minutes to prevent it from sleeping

app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
// app.use('/checkout-session', paymentRoute);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 4000;
}
app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
