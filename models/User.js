const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 6,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxlength: 1024
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET,  { expiresIn: process.env.JWT_TIMEOUT_DURATION })
    this.tokens.push({ token })
    await this.save()

    return token
}

// define our own method to find user using both his email and password
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email: email })

    if (user) {
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            return user
        }
    }

    throw new Error('incorrect credentials')
}

// add middleware to hash the user password before saving it
userSchema.pre('save', async function (next) {
    // this condition will be true in the first creation of the user and everytime the password gets changed
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8) // 8 is the number of times to hash the password, a bigger number means more security but also means more execution time
    }

    next()
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel