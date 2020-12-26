const { EMSGSIZE } = require('constants')
const User = require('../models/User')


const register = async (req, res) => {
    const data = req.body
    let user = {
		name: data.name,
		email: data.email,
		password: data.password,
		role: data.role,
	}
	const userModel = new User(user)

	try {
        await userModel.save()
        const token = await userModel.generateAuthToken()
        delete user.password
		res.status(201).send({...user, token })
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

const logout = async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
		await req.user.save()

		res.send('logged out')
	} catch (error) {
		console.log(error)
		res.status(500).send('error')
	}
}

module.exports = {
    register,
	login,
	logout
}
