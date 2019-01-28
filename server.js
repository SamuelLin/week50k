const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, '/dist')))

// Catch all routes and redirect to the index file
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 5000

app.listen(port)
// Log to feedback that this is actually running
console.log('Server started on port ' + port)
