const express = require('express')
const history = require('connect-history-api-fallback')
const serveStatic = require('serve-static')
const path = require('path')

const app = express()

app.use(history({ verbose: true }))
app.use('/', serveStatic(path.join(__dirname, '/dist')))

// Catch all routes and redirect to the index file
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 5000

app.listen(port)
// Log to feedback that this is actually running
console.log('Server started on port ' + port)
