'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/login', 'AuthController.create')
Route.get('/connection', 'ConnectionController.create')

Route.group(() => {
  Route.get('/company', 'CompanyController.index')
  Route.post('/company/create', 'CompanyController.store')

  Route.get('/user', 'UserController.index')
  Route.post('/user', 'UserController.store')
  Route.get('/user/:id', 'UserController.show')
  Route.put('/user/:id', 'UserController.update')
  Route.put('/user/:id/disable', 'UserController.disable')
  Route.put('/user/:id/enable', 'UserController.enable')
}).middleware('auth')
