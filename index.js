var fs = require('fs');
var _ = require('underscore');
var request = require('request');

module.exports = {
  getList: getList
};

function getList(listName, cb){
  var file = process.env.OPENSHIFT_DATA_DIR + listName + '.json';
  fs.exist(file, function(err, exist){
    if(exist){
      file.readFile(file, function(err, content){
        if(err){
          return cb(err);
        }
        cb(null, JSON.parse(content));
      });
      return
    }

    request('https://raw.githubusercontent.com/Filirom1/nowel/master/' + listName + '.json', function(err, body){
      if(err){
        return cb(err);
      }

      us = JSON.parse(body);
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

      });
      fs.writeFile(file, JSON.stringify(list), function(err){
        if(err){
          return cb(err);
        }
        cb(null, list)
      });
    });
  });
}


}
