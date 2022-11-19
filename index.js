var fs = require('fs');
var _ = require('underscore');
var request = require('request');
var yaml = require('js-yaml');

module.exports = {
  getList: getList
};

function getList(listName, cb){
  console.log(listName)
  var file = "./public/json/" + listName + '.json';
  fs.exists(file, function(exists){
    if(exists){
      fs.readFile(file, function(err, content){
        if(err){
          return cb(err);
        }
        cb(null, JSON.parse(content));
      });
      return
    }
	fs.readFile('./list/' + listName + '.yml', function(err, body){
      if(err){
        return cb(err);
      }
      us = yaml.safeLoad(body);
      nowel();

      var list;
      function nowel(){
        try{
          list = [];
          people = _.shuffle(us);
          while(people.length > 0){
            if(list.length > 0){
              if(people.length === 1){
                if(list[0].group == people[0].group) throw new Error('conflict');
              }
              if(_(list).last().group == people[0].group) throw new Error('conflict');
            }
            list.push(people.splice(0, 1)[0]);
          }
        }catch(err){
          //console.error(err);
          return nowel();
        }
      }
      console.log("write " + file)
      fs.writeFile(file, JSON.stringify(list), function(err){
        if(err){
          return cb(err);
        }
        cb(null, list)
      });
    });
  });
}
