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


Settings.config({
  username:"",
  password:"",
  url:"",
  defaultVisualization:""},
  function(e){
    console.log('Closed Configurable');
    if ( e ){
      console.log("error : "+e);  
    }
  });


var user= Settings.option("username");
var password= Settings.option("password");
var esURL = Settings.option("url");
var defaultSearch = Settings.option("defaultVisualization");

var main = new UI.Card({
  title:"Elastic Search Viewer"
});

console.log("Checking Base64 "+typeof base64);

if ( !user || !esURL ){
  var x = base64.encode("readonly:readonly");
  console.log('Not Configured but encoded x = ' + x); 
  main.body="Not Configured";
  
  
}else{
  var hash = base64.encode(user+":"+password);
  console.log("Password Hash is: "+hash);
  
  main.body("Configured");
  
}
console.log("Main "+JSON.stringify(main));
main.show();

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
  var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});


