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

// ! note: u need 3 variables in your .env to run the server, just create it in the root of the project and add: DB & PORT & JWT_SECRET
// ! remove this comment once done
// ! and btw install the extension "better comments" on vs code to get nice colors on the comments ;)