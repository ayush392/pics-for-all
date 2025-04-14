// const express = require('express');
// const router = express.Router();
// const requireAuth = require('../middleware/requireAuth');
// const { errorResponse, successResponse } = require('../utils/responseHandler');

// //Payment gateway integration
// const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

// router.post('/', requireAuth, async (req, res) => {
//     try {
//         // console.log('post req in server successful')
//         const session = await stripe.checkout.sessions.create({
//             // payment_method_types: ['card'],
//             mode: 'payment',
//             line_items: [{
//                 price_data: {
//                     currency: 'inr',
//                     product_data: {
//                         name: 'PicsForAll plus subscription',
//                     },
//                     unit_amount: 9900,
//                 },
//                 quantity: 1,
//             }],

//             success_url: 'https://picsforall.netlify.app/',
//             cancel_url: 'https://picsforall.netlify.app/plus',
//         })
//         successResponse(res, 200, session, 'Payment session created successfully')

//     } catch (e) {
//        errorResponse(res,e,500);
//     }
// })

// module.exports = router