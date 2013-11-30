var express = require('express');
var fs = require('fs');
var _ = require('underscore');
require('./index');
var app = express();

var file = process.env.OPENSHIFT_DATA_DIR + 'nowel.json';
var json = JSON.parse(fs.readFileSync(file).toString());
var list = _.pluck(json, 'name');
list.push(list[0]);

app.use(express.static(__dirname + '/public'));

app.get('/nowel', function(req, res){
  var name = req.query.name.toLowerCase().replace(/ /, '-');
  try{
    if(list.indexOf(name) === -1) throw new Error('invalid name');
    res.send(list[list.indexOf(name)+1]);
  }catch(e){
    console.error(name, e);
    return res.send(400, e.message);
  }
});

app.listen(+process.env.OPENSHIFT_NODEJS_PORT || 8080, process.env.OPENSHIFT_NODEJS_IP);
