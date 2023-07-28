const { User } = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = function (_id) {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

//login user
const loginUser = async function (req, res) {
    const { email, password } = req.body
    try {
        const user = await User.login(email, password)
        console.log(user.user.username, 13)
        //create token
        const token = createToken(user._id)
        const username = user.user.username
        res.status(200).json({ email, token, username })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// signup user
const signupUser = async function (req, res) {
    const { fName, lName, email, username, password } = req.body
    try {
        const user = await User.signup(fName, lName, email, username, password)
        // console.log(user, 28)
        //create token
        const token = createToken(user._id)

        res.status(200).json({ email, token, username })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { loginUser, signupUser };
