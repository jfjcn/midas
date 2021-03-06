console.log('Loading... ', __filename);

/**
 * Session
 *
 * Sails session integration leans heavily on the great work already done by Express, but also unifies
 * Socket.io with the Connect session store. It uses Connect's cookie parser to normalize configuration
 * differences between Express and Socket.io and hooks into Sails' middleware interpreter to allow you
 * to access and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#documentation
 */

var session = {

  // Session secret is automatically generated when your new app is created
  // Replace at your own risk in production-- you will invalidate the cookies of your users,
  // forcing them to log in again.
  secret: '0fa32505a53e70cd2b5626d70dd15b6c',

  // Set the cookie maximum age (timeout).  If this is not set, then cookies
  // will persist forever.
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }

};

// Build database config
if (process.env.NODE_ENV !== 'test') {

  var pgSession = require('connect-pg-simple'),
      express = require('sails/node_modules/express'),
      pg = require('sails-postgresql/node_modules/pg'),
      environment = process.env.NODE_ENV || 'development',
      configs = ['./connections', './env/' + environment, './local'],
      config = {};

  configs.forEach(function(c) {
    try { extend(config, require(c).connections.postgresql); } catch(e) {}
  });

  function extend(obj, props) {
    for (prop in props) {
      if (props.hasOwnProperty(prop)) { obj[prop] = props[prop]; }
    }
  }

  if (Object.keys(config).length > 0) {
    session.store = new (pgSession(express.session))({
      conString: config,
      pg: pg
    });
  }

}

module.exports.session = session;
