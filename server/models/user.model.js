const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
    },
    lName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: () => {
          const gender = Math.floor(Math.random() * 2) === 0 ? "male" : "female";
          const id = Math.floor(Math.random() * 50);
          return `https://xsgames.co/randomusers/assets/avatars/${gender}/${id}.jpg`;
        },
      },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);