require("dotenv").config();
const express = require('express');
const dbConnect = require("./db/dbConnect");
const cors = require('cors')
const requireAuth = require('./middleware/requireAuth')

const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post');

const app = express();

dbConnect();

// middleware
app.use(cors({ Credential: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static('public'))


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
            success_url: 'https://unsplash.com/',
            // cancel_url: 'https://www.google.com',
        })
        res.json({ url: session.url })

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})


app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 4000;
}
app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});