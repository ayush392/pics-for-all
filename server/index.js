require("dotenv").config();
const express = require('express');
const dbConnect = require("./db/dbConnect");
const path = require('path')
const requireAuth = require('./middleware/requireAuth')

// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

const userRoutes = require('./routes/user')
const workoutRoutes = require('./routes/workout');
const postRoutes = require('./routes/post');

const app = express();

dbConnect();


// middleware
app.use(express.json())
// app.use(express.static('public'))
// app.use('/photos', express.static('public'))
// app.use('/user', express.static('public'))
// app.use('/likes', express.static('public'))
// app.use('/s/photos', express.static('public'))

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


// upload image
// app.post('/user/upload', upload.single('image'), function (req, res) {
//     console.log(req.file);
//     console.log(req.body);
//     // console.log(req.file);
// })


// app.get('/', function(req, res){
//     res.send('hello');
// })

app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/posts', postRoutes);

app.listen(4000, () => console.log('server started in port 4000'));