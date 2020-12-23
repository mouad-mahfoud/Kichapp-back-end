const User = require('../model/User')


const register = async (req, res) => {
    const data = req.body
    
	const user = new User({
		name: data.name,
		email: data.email,
		password: data.password
	})

	try {
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({ token })
	} catch (error) {
		// TODO we should filter the error we send back
		res.status(400).send(error.message)
	}
}

const login = async (req, res) => {
	const data = req.body

	try {
		const user = await User.findByCredentials(data.email, data.password)
		const token = await user.generateAuthToken()
		res.send({ user, token })
	} catch (error) {
		console.log(error)
		res.status(400).send('no user found')
	}
}


module.exports = {
    register,
    login
}
