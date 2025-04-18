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

// middleware
app.use(cors({ Credential: true }))
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

schedulePingServer(); // ping server every 14 minutes to prevent it from sleeping

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