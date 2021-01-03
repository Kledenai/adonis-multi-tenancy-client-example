'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

const uuidv4 = require('uuid/v4')

const UserHook = (exports = module.exports = {})

UserHook.uuid = async user => {
  const uuid = uuidv4().toString('hex')
  user.id = uuid.split('-').join('')
}

UserHook.password = async userInstance => {
  if (userInstance.dirty.password) {
    userInstance.password = await Hash.make(userInstance.password)
  }
}
