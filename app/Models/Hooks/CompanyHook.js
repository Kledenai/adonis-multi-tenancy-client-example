'use strict'

const Database = use('Database')
const uuidv4 = require('uuid/v4')

const CompanyHook = exports = module.exports = {}

CompanyHook.uuid = async company => {''
  const uuid = uuidv4().toString('hex')
  company.id = uuid.split('-').join('')
}

CompanyHook.createDatabase = async (company) => {
  await Database.raw(`CREATE SCHEMA ${company.db_database}`)
}
