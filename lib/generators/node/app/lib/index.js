var http = require('http')
  , config = require('../config')
  , app;

app = http.createServer(function(socket) {
  socket.end("Goodbye\n");
});

app.listen(config.port, function() {
  if (!module.parent) {
    var address = app.address();
    console.log('listening on %s:%s', address.address, address.port);
  }
});

module.exports = app;
