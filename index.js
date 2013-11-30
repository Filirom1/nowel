var fs = require('fs');
var _ = require('underscore');

var file = process.env.OPENSHIFT_DATA_DIR + 'nowel.json';

if(!fs.existsSync(file)){

  var us = [{
    group: 1,
    name: 'corinne'
  }, {
    group: 1,
    name: 'romain'
  }, {
    group: 2,
    name: 'marie'
  }, {
    group: 2,
    name: 'yannick'
  }, {
    group: 3,
    name: 'nathalie'
  }, {
    group: 3,
    name: 'dominique'
  }, {
    group: 4,
    name: 'marie-france'
  }, {
    group: 4,
    name: 'bernard'
  }];

  nowel();

  var list = [];

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
    console.log(list);
    fs.writeFileSync(file, JSON.stringify(list));
  }
}
