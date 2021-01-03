'use strict'

const Hash = use('Hash')
const User = use('App/Models/User')
const { validate } = use('Validator')

class AuthController {
  async create ({ request, response, auth }) {
    const { email, password } = request.all()

    const rules = {
      email: 'required|email',
      password: 'required'
    }

    const messages = {
      'email.required': 'Please add the email',
      'email.email': 'Please add a valid email format',
      'password.required': 'Please add the password'
    }

    const validation = await validate(request.all(), rules, messages)

    if (validation.fails()) {
      const error = validation.messages()
      const { message } = error[0]

      return response.status(400).json({ message: message })
    }

    try {
      let user = await User.findBy('email', email)

      if (await !user) {
        return response.status(404).json({ message: 'User not found' })
      }

      const isSame = await Hash.verify(password, user.password)

      if ((await isSame) === false) {
        return response.status(404).json({ message: 'Unknown password' })
      }

      const isActive = user.is_active

      if (await isActive == false) {
        return response
          .status(400)
          .json({ message: 'Your user account is disabled' })
      }

      const token = await auth.attempt(email, password)

      return response.status(201).json({ user: user, token: token })
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}

module.exports = AuthController
