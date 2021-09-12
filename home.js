// ============================================================================|
/*
* Project : HEARIT.IO
*
* Developing an innovative connected/smart home intelligent
* management system for the needs of blind or visually impaired
* persons.
*
* Purpose:
*
* A foront end part of a SSE example including page rendering and a
* SSE clinet implementation (used in a similar way in https://app.hearit.io).
*
* Author: Emil Usunov, hearit.io
*
* License: MIT
*
*/
// ============================================================================|
'use strict'

const {
  pingIntervalMs
} = require('./constants')


// ----------------------------------------------------------------------------|
// A fastify route handler for GET '/'
// ----------------------------------------------------------------------------|
module.exports = function (request, reply) {
  reply.type('text/html').send(render('/sse', pingIntervalMs))
}

// ----------------------------------------------------------------------------|
// Renders a page and starts a SSE clinet for a given sseUrl.
// Displays SSE messages and a connection status.
// Reconnects to SSE on a user activity on the page.
// ----------------------------------------------------------------------------|
function render (sseUrl = '/sse', pingIntervalMs = 10000) {

  const page = String.raw`

  <!DOCTYPE html>
  <html>
    <head>
      <script type="module" async>

      const userActivityEventList = ['mousedown', 'click', 'focus',
        'blur', 'keydown', 'keypressed', 'resize', 'scroll',
        'touchstart', 'touchend']

      // ----------------------------------------------------------------------|
      // A frontend SSE implementation
      // ----------------------------------------------------------------------|
      class SsePushService {

        constructor (url = '/sse', pingIntervalMs = 30000) {
          this.url_ = url
          this.es_ = undefined
          this.pingIntervalMs_ = pingIntervalMs
          this.lastEventId_ = undefined
          this.idElem_ = document.getElementById('id')
          this.dataElem_ = document.getElementById('data')
          this.statusElem_ = document.getElementById('status')
        }

        // --------------------------------------------------------------------|
        // Starts a service
        // --------------------------------------------------------------------|
        start () {
          let url = this.url_
          if (typeof this.lastEventId_ !== typeof undefined &&
              this.lastEventId_.length > 0) {
            url += '?id=' + this.lastEventId_
          }

          this.es_ = new EventSource(url, {withCredentials: true})

          this.es_.addEventListener('open', this.sseEventHandler_.bind(this))
          this.es_.addEventListener('error', this.sseEventHandler_.bind(this))
          this.es_.addEventListener('message', this.sseEventHandler_.bind(this))
          this.es_.addEventListener('ping', this.sseEventHandler_.bind(this))
          this.es_.addEventListener('gap', this.sseEventHandler_.bind(this))
        }

        // --------------------------------------------------------------------|
        // Stops a service
        // --------------------------------------------------------------------|
        stop () {
          this.es_.removeEventListener('open', this.sseEventHandler_)
          this.es_.removeEventListener('error', this.sseEventHandler_)
          this.es_.removeEventListener('message', this.sseEventHandler_)
          this.es_.removeEventListener('ping', this.sseEventHandler_)
          this.es_.removeEventListener('gap', this.sseEventHandler_)

          if (this.es_.readyState !== 'closed') {
            this.es_.close()
          }
          this.es_ = undefined
        }

        // --------------------------------------------------------------------|
        // Enables connect/reconnect on user activity.
        // --------------------------------------------------------------------|
        connectOnUserActivity () {
          for (const activity of userActivityEventList) {
            window.addEventListener(activity, (event) => {
              if (typeof this.es_ === typeof undefined) {
                this.start()
              }
            })
          }
        }

        // --------------------------------------------------------------------|
        // Handles all starndart (open, message, error) and 
        // named SSE events (ping, gap)
        // --------------------------------------------------------------------|
        sseEventHandler_ (event) {
          const type = event.type

          // Display SSE id and message 
          if (type === 'message') {
            this.idElem_.textContent = event.lastEventId
            this.dataElem_.textContent = event.data
            this.lastEventId_ = event.lastEventId
            return
          }

          // Display SSE status
          this.statusElem_.textContent = type.toUpperCase() + ' at ' +
            (new Date(Date.now())).toISOString()

          // Close a SSE connection
          if (type === 'error') {
            this.stop()
            return
          }

          // Implement handling of 'open', 'ping' and 'gap' events.
        }
      }
      // Start a service
      const sse = new SsePushService('${sseUrl}', ${pingIntervalMs})
      sse.start()
      sse.connectOnUserActivity()

      </script>

    </head>

    <!-- A HTML to display all related SSE information ------------------------>
    <body>
      <h1>
        <span>SSE Id: </span><span id="id"></span>
      </h1>
      <h1>
        <span>SSE Data: </span><span id="data"></span>
      </h1>
      <h2>
        <span>SSE Status: </span><span id="status"></span>
      </h2>
    </body>
  </html>

  `
  return page
}
