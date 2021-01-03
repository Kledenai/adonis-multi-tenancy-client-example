'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CompanySchema extends Schema {
  up () {
    this.create('companies', (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('subdomain').notNullable().unique()
      table.string('db_database').notNullable().unique()
      table.string('db_hostname').notNullable()
      table.string('db_username').notNullable()
      table.string('db_password').notNullable()
      table.boolean('is_active').defaultTo(true)
      table.uuid('user_id').references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('companies')
  }
}

module.exports = CompanySchema
