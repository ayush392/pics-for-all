const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHandler');

const requireAuth = async (req, res, next) => {
    // console.log('Require Auth middleware called');

    // verify authentication
    const { authorization } = req.headers

    if (!authorization) {
        errorResponse(res, '', 401, 'Unauthorized', 'Authorization token is required')
        return;
    }

    const token = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(token, process.env.SECRET)

        req.user = _id;
        next()

    } catch (error) {
        errorResponse(res, error, 401, 'Unauthorized', 'Invalid authorization token')
    }
}

module.exports = requireAuth;