'use strict'

const { hooks } = require('@adonisjs/ignitor')

hooks.after.httpServer(() => {
  use('App/Services/Nuxt')

  // const srv = use('Adonis/Src/Server').getInstance()
  // if (srv) {
  //   srv.timeout = 300000         // 5 phút
  //   srv.keepAliveTimeout = 310000
  //   srv.headersTimeout = 320000
  //   console.log('[server] timeout set to 300s')
  // }
})

/**
 * Helpers
 */
hooks.after.providersBooted(() => {
  const View = use('View')
  const Env = use('Env')

  View.global('rootUrl', () => {
    return Env.get('APP_URL')
  })

  View.global('awcUrl', () => {
    return `${Env.get('APP_URL')}/awc`
  })
})
