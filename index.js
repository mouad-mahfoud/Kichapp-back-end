require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()

// connect to DB
mongoose.connect(
	process.env.DB,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
	() => console.log('connected to db')
)

// middleware
app.use(morgan('dev'))
app.use(express.json())

// routes
const authRoute = require('./routes/auth')
app.use('/user', authRoute)

// start server
app.listen(process.env.PORT, () => console.log(`App listening at http://localhost:${process.env.PORT}`))