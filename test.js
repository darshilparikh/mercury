var app = require('./config/express')(db);
var fs = require('fs')

var indico = require(__dirname+'/app/routes/indico.server.routes.js');

indico(app, 'asdsa');


indico.sentimentHQ("kill yourself")	
.then(response)
.catch(logError);

fs.readFile('./sample.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});

