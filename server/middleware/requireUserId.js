const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');

const requireUserId = async (req, res, next) => {
    // console.log('Require Auth middleware called');

    // verify authentication
    const { authorization } = req.headers
    try {

        if (authorization) {
            const token = authorization?.split(' ')[1];
            if(token){
                const { _id } = jwt.verify(token, process.env.SECRET)
                req.user = _id;
            }
        }

        next();

    } catch (error) {
        // errorResponse(res, error, 400, 'BadRequest', 'Invalid authorization token')
        next();
    }
}

module.exports = requireUserId;