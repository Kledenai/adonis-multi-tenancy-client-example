'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Company extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'CompanyHook.uuid')
    this.addHook('afterCreate', 'CompanyHook.createDatabase')
  }

  static get hidden () {
    return [
      'created_at',
      'updated_at'
    ]
  }
}

module.exports = Company
