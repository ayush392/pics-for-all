require("dotenv").config();
const express = require('express');
const dbConnect = require("./db/dbConnect");
const path = require('path')
const requireAuth = require('./middleware/requireAuth')

// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post');

const app = express();

dbConnect();


// middleware
app.use(express.json())

//Payment gateway integration

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

app.post('/checkout-session', requireAuth, async (req, res) => {
    try {
        // console.log('post req in server successful')
        const session = await stripe.checkout.sessions.create({
            // payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'PicsForAll plus subscription',
                    },
                    unit_amount: 9900,
                },
                quantity: 1,
            }],

            // TODO: MODIIFY THESE LINKS
            success_url: 'https://picsforall.cyclic.app/',
            // cancel_url: 'https://www.google.com',
        })
        res.json({ url: session.url })

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})



app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);

// if (app.settings.env !== 'development') {
//Serving the frontend
app.use(express.static(path.join(__dirname, "./client/build")));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});
// }

let port = process.env.PORT || 4000;
app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});