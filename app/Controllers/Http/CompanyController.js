'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

const Company = use('App/Models/Company')
const { validate } = use('Validator')

class CompanyController {
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
      const companies = await Company.query()
        .where('is_active', '=', data.is_active)
        .fetch()

      return response.status(200).json(companies)
    } catch (error) {
      return response.status(401).json({ error: error.message })
    }
  }

  async store ({ request, response }) {
    const data = request.only([
      'name',
      'subdomain',
    ])

    const rules = {
      name: 'required',
      subdomain: 'required|unique:companies',
    }

    const messages = {
      'name.required': 'Please add the name',
      'subdomain.required': 'Please add the subdomain',
      'subdomain.unique': 'This subdomain is already registered',
    }

    const validation = await validate(request.all(), rules, messages)

    if (validation.fails()) {
      const error = validation.messages()
      const { message } = error[0]

      return response.status(400).json({ message: message })
    }

    try {
      await Company.create({
        name: data.name,
        subdomain: data.subdomain,
        db_database: `${data.subdomain}_${Date.now()}`,
        db_hostname: Env.get('DB_HOST'),
        db_username: Env.get('DB_USER'),
        db_password: Env.get('DB_PASSWORD'),
      })

      return response
        .status(201)
        .json({ message: 'Company created successful' })
    } catch (error) {
      return response.status(401).json({ message: error.message })
    }
  }
}

module.exports = CompanyController
