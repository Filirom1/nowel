var express = require('express');
var fs = require('fs');
var _ = require('underscore');
var getList = require('./index').getList;
var app = express();


app.use(express.static(__dirname + '/public'));

app.get('/:list', function(req, res){
  var listName = req.param('list');
  var name = req.query.name.toLowerCase().replace(/ /, '-');

  getList(listName, function(json){
    var list = _.pluck(json, 'name');
    list.push(list[0]);

    try{
      if(list.indexOf(name) === -1) throw new Error('invalid name');
      res.send(list[list.indexOf(name)+1]);
    }catch(e){
      console.error(name, e);
      return res.send(400, e.message);
    }
  });
});

app.listen(+process.env.OPENSHIFT_NODEJS_PORT || 8080, process.env.OPENSHIFT_NODEJS_IP);
