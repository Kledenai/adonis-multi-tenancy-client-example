'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {
  async index ({ request, response }) {
    const data = request.get()

    const rules = { is_active: 'required' }

    const messages = {
      'is_active.required':
        'Please inform if you want the data archived or not'
    }

    const validation = await validate(request.get(), rules, messages)

    if (validation.fails()) {
      const error = validation.messages()
      const { message } = error[0]

      return response.status(400).json({ message: message })
    }

    try {
      const users = await User.query()
        .where('is_active', '=', data.is_active)
        .fetch()

      return response.status(200).json(users)
    } catch (error) {
      return response.status(401).json({ error: error.message })
    }
  }

  async store ({ request, response }) {
    const data = request.only([
      'name',
      'email',
      'password',
      'password_confirmation',
    ])

    const rules = {
      name: 'required',
      email: 'required|email|unique:users,email',
      password: 'required',
      password_confirmation: 'required_if:password|same:password',
    }

    const messages = {
      'name.required': 'Please add the name',
      'email.required': 'Please add the email',
      'email.email': 'Please add a valid email format',
      'email.unique': 'This email is already registered',
      'password.required': 'Please add the password'
    }

    const validation = await validate(request.all(), rules, messages)

    if (validation.fails()) {
      const error = validation.messages()
      const { message } = error[0]

      return response.status(400).json({ message: message })
    }

    try {
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      return response
        .status(201)
        .json({ message: 'Your user created successful' })
    } catch (error) {
      return response.status(401).json({ message: error.message })
    }
  }

  async show ({ params, response }) {
    try {
      const user = await User
        .query()
        .where('id', '=', params.id)
        .first()

      if (await !user) {
        return response.status(403).json({ message: 'User not found' })
      }

      return response.status(200).json(user)
    } catch (error) {
      return response.status(error.status).json({ message: error })
    }
  }

  async update ({ request, response, params }) {
    const rules = {
      name: 'required',
      email: 'required|email'
    }

    const messages = {
      'name.required': 'Please add the name',
      'email.required': 'Please add the email',
      'email.email': 'Please add a valid email format'
    }

    const validation = await validate(request.all(), rules, messages)

    if (validation.fails()) {
      const error = validation.messages()
      const { message } = error[0]

      return response.status(400).json({ message: message })
    }

    try {
      const user = await User.findOrFail(params.id)

      user.merge(request.all())

      await user.save()

      return response.status(200).json({ message: 'User update successful' })
    } catch (error) {
      return response.status(401).json({ error: error.message })
    }
  }

  async disable ({ response, params }) {
    try {
      const user = await User.findOrFail(params.id)

      if ((await user.is_active) === false) {
        return response
          .status(400)
          .json({ error: 'Your user is already disabled' })
      }

      await user.merge({ is_active: false })

      await user.save()

      return response.status(200).json({ message: 'User disable successful' })
    } catch (error) {
      return response.status().json({ error: error.message })
    }
  }

  async enable ({ response, params }) {
    try {
      const user = await User.findOrFail(params.id)

      if ((await user.is_active) === true) {
        return response
          .status(400)
          .json({ error: 'Your user is already enabled' })
      }

      user.merge({ is_active: true })

      await user.save()

      return response.status(200).json({ message: 'User enable successful' })
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}

module.exports = UserController
