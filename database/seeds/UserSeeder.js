'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class UserSeeder {
  async run () {
    await Factory.model('App/Models/User').create({
      name: 'Kledenai Ashver',
      email: 'client@test.com.br',
      password: 'admin',
    })
  }
}

module.exports = UserSeeder
