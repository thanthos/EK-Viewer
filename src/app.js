/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
'use strict';

var UI = require('ui');
var Vector2 = require('vector2');
var base64 = require('base64');
var Settings = require('settings');
var ajax = require('ajax');
var Clock = require('clock');
var queryString = 'q=_type:visualization&_source=false&fields=visState';

Settings.config({
  url:"http://pebble-config.herokuapp.com/config?title=ElasticSearch%20Pebble&fields=text_Username,password_Password,text_URL,text_Search" 
},
 function(e) {
    console.log('opening configurable');
    
   //TODO: Somehow populate the option with the set values. pebble-config.herokuapp.com cannot do that.
  },
 function(e) {
    var config = JSON.parse(e.response);
    var updateConfig = {};
    console.log('closed configurable '+JSON.stringify(config));
   
    for ( var i in config){
      if ( config.hasOwnProperty[i]) {
        if ( config[i] != "" ){
          console.log("Setting "+i+" with "+config[i]);  
          Settings.option(i,config[i]);
        }
      }
    }
  });

var main = new UI.Card({title:'Pebble ElasticSearch'});

var user= Settings.option("Username");
var password= Settings.option("Password");
var esURL = Settings.option("URL");
var defaultSearch = Settings.option("defaultVisualization");

console.log(JSON.stringify(Settings.option()));

if ( !user || !esURL ){
  main.body='Not Configured';
  main.show();
}else{
  
  var hash = base64.encode(user+":"+password);
  console.log("Attempting to Connect to Elastic Search ");
  main.body="Displaying Result ";
  ajax( {
    url: esURL+"/"+queryString,
    type: 'application/json; charset=UTF-8',
    headers: "Basic "+hash
  },
  function(data, status, request) {
    console.log('Success  ' + data.contents.quote);
    
  },
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
  }
);
  
}

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var action = new UI.Card({title:'Pebble ElasticSearch'});
  var hash = base64.encode(Settings.option("Username")+":"+Settings.option("Password"));
  console.log("Attempting to Connect to Elastic Search ");
  action.body="Displaying Result ";
  ajax( {
    url: esURL+"/"+queryString,
    type: 'application/json; charset=UTF-8',
    headers: "Basic "+hash
  },
  function(data, status, request) {
    console.log('Success  ' + data.contents.quote);
    
  },
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
    action.body='The ajax request failed: ' + error;
    action.show();
  }
);
  
  
                           
  action.show();
//   var wind = new UI.Window();
//   var textfield = new UI.Text({
//     position: new Vector2(0, 50),
//     size: new Vector2(144, 30),
//     font: 'gothic-24-bold',
//     text: 'Text Anywhere!',
//     textAlign: 'center'
//   });
//   wind.add(textfield);
//   wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});


