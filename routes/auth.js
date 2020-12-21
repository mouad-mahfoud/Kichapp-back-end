const router = require('express').Router()
const User = require('../model/User')
const auth = require('../middleware/auth')

router.post('/register', async (req, res) => {
	const data = req.body

	const user = new User({
		name: data.name,
		email: data.email,
		password: data.password
	})

	try {
		await user.save()
		const token = await user.generateAuthToken()
		res.send({ user, token })
	} catch (error) {
		// TODO we should filter the error we send back
		res.status(400).send(error)
	}
})

router.post('/login', async (req, res) => {
	const data = req.body

	try {
		const user = await User.findByCredentials(data.email, data.password)
		const token = await user.generateAuthToken()
		res.send({ user, token })
	} catch (error) {
		console.log(error)
		res.status(400).send('no user found')
	}
})

router.get('/private', auth, (req, res) => {
	res.send(`Welcome ${req.user.name}`)
})

module.exports = router