'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'UserHook.uuid')
    this.addHook('beforeSave', 'UserHook.password')
  }

  static get hidden () {
    return [
      'password',
      'created_at',
      'updated_at'
    ]
  }

  static get primaryKey () {
    return 'id'
  }

  static get incrementing () {
    return false
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = User
