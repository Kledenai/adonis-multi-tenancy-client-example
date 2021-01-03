'use strict'

const Company = use('App/Models/Company')
const { validate } = use('Validator')

class ConnectionController {
  async create({request, response}) {
    try {
      const data = request.get()

      const rules = { subdomain: 'required' }

      const messages = {
        'subdomain.required':
          'Please inform the subdomain'
      }

      const validation = await validate(request.get(), rules, messages)

      if (validation.fails()) {
        const error = validation.messages()
        const { message } = error[0]

        return response.status(400).json({ message: message })
      }

      const connection = await Company.findBy('subdomain', data.subdomain)

      if (await !connection) {
        return response.status(403).json({ message: 'Connection not found' })
      }

      return response.status(200).json(connection)
    } catch (error) {
      return response.status(401).json({ error: error.message })
    }
  }
}

module.exports = ConnectionController
