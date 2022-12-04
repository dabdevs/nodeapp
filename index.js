/**
 * Primary file for API
 */

// Dependencies
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')

// THe server should respond to all request with a string
const server = http.createServer((req, res) => {

    // Get the URL and parse it
    const parsedUurl = url.parse(req.url, true)

    // Get the path from the parsed URL
    let  untrimmedPath = parsedUurl.pathname
    const path = untrimmedPath.replace(/^\/+|\/+$/g, '')

    // Get the query string data as an object
    let queryStrObject = parsedUurl.query 

    // Get the HTTP methods
    const method = req.method.toLowerCase()

    // Get the headers as object 
    const headers = req.headers

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8')
    let payload = '';
    req.on('data', function(data) {
        payload += decoder.write(data)
    })

    req.on('end', function() {
        payload += decoder.end()

        // Choose the handler the request should go to
        let chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound

        // Construct the data object to send to the handler
        let data = {
            'path': path,
            'queryStrObject': queryStrObject,
            'method': method,
            'headers': headers,
            'payload': payload
        }

        // Route the request to the chosen handler 
        chosenHandler(data, function(statusCode, payload) {
            // Use the status code called back by the handler, or default 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200

            // Use the payload called back by the handler, or defauld to empty object
            payload = typeof(payload) == 'object' ? payload : {}

            // Send the response 
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(JSON.stringify(payload))

            // Log the request path in console    
            console.log('Returning response : ', statusCode, payload)
        })
    })
}) 

// Start the server
const port = config.port
server.listen(port, () => {
    console.log('The server is listening on port '+port)
    console.log('Environment: '+config.envName)
})

// Define the handlers
let handlers = {}

// Sample handler
handlers.sample = function(data, callback) {
    // Callback a http status cod, and a payload object
    callback(406, {'name': 'sample handler'})
}

handlers.notFound = function(data, callback) {
    callback(404)
}

// Define a request router
let router = {
    'sample': handlers.sample
}