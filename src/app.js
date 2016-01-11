/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
//var Vector2 = require('vector2');
var base64 = require('base64');
var Settings = require('settings');
var ajax = require('ajax');
//var Clock = require('clock');
var queryString = 'q=_type:visualization&_source=false&fields=visState';
var searchIndex = '.kibana/_search?';

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
//var defaultSearch = Settings.option("defaultVisualization");



function elasticSearch(query, failure, success){
  var hash = base64.encode(Settings.option("Username")+":"+Settings.option("Password"));
  console.log("Ajax Authorization Basic "+hash);
  console.log("Ajax url: "+esURL+"/"+searchIndex+queryString);

  ajax( {
    url: esURL+"/"+searchIndex+queryString ,
    headers: {Authorization:"Basic "+hash} },
    success,
    failure
  );
}

console.log(JSON.stringify(Settings.option()));

if ( !user || !esURL ){
  main.body='Not Configured';
  main.show();
}else{  
  console.log("Attempting to Connect to Elastic Search Onload");
  elasticSearch(queryString,
    function(error, status, request) {
      console.log('The ajax request failed: ' + JSON.stringify(error));
      console.log('Request : ' + JSON.stringify(request));
    },
    function(data, status, request) {
      console.log('Status : ' + JSON.stringify(status));
      console.log('Payload : ' + JSON.stringify(data));}
  );
  main.body="Displaying Result";
  main.show(); 
  console.log("End");

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
  console.log("Attempting to Connect to Elastic Search On Demand");
  action.body="Displaying Result ";
  elasticSearch(queryString, 
    function(error, status, request) {
      console.log('The ajax request failed: ' + JSON.stringify(error)); },
    function(data, status, request) {
      console.log('Data : ' + JSON.stringify(data));});
 action.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});


