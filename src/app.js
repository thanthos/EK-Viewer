/**
 * Welcome to Pebble.js!
**/

var UI = require('ui');
var Vector2 = require('vector2');
var base64 = require('base64');
var Settings = require('settings');
var ajax = require('ajax');
//var Clock = require('clock');

//Global Variables
var queryString = 'q=_type:visualization&_source=false&fields=visState,title';
var kibannaIndex = '.kibana/_search?';
var user= Settings.option("Username");
var esURL = Settings.option("URL");

Settings.config({url:"http://pebble-config.herokuapp.com/config?title=ElasticSearch%20Pebble&fields=text_Username,password_Password,text_URL,text_Index-to-Search,number_Minutes-to-Show,number_Refresh-in-Minutes" },
  function(e) {  
   //console.log('opening configurable');
   //TODO: Somehow populate the option with the set values. pebble-config.herokuapp.com cannot do that.
  },
  function(e) {
    var config = JSON.parse(e.response);
    var updateConfig = {};
    //console.log('closed configurable '+JSON.stringify(config));
  });


//Main Display Using Windows----------
/*Design Consideration:
A temporary cover page for Branding
2 Layer Display - Show the ID/Title of the visualization and the value.
This 2 objects are global objects so that the display can be changed from anywhere.
*/
var main = new UI.Window();
var coverPage = new UI.Window(); //Set as place holder first
var title = new UI.Text({
            position: new Vector2(0, 0), 
            size: new Vector2(144, 25),
            text:"Title",
            color:"white",
            font:'gothic_24',
            textOverflow:'ellipsis',
            textAlign:'center',
            borderColor:'clear'});
var selectedIndex = new UI.Text(); //Place holder 
var msg = new UI.Text({
            position: new Vector2(0, 50), 
            size: new Vector2(144, 110),
            text:"Value",
            color:"white",
            font:'bitham_42_light',
            borderColor:'clear',
            textAlign:'center'});
var footer = new UI.Text({
            position: new Vector2(0, 140), 
            size: new Vector2(144, 25),
            text:"timestamp",
            color:"white",
            font:'gothic_24',
            textOverflow:'ellipsis',
            borderColor:'clear',
            textAlign:'center'});
main.add(title);
main.add(msg);
main.add(footer);
main.show();
//--------------------

//Menus -----------------
var menu = new UI.Menu({
 sections: [{
      title: 'Menus Action',
      items: [{ title:'Refresh Menu', subtitle:'Refresh the visualization saved in menus'}]   
 }]});

menu.on('select', 
            function(e) {
              //console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
              console.log('The item is titled "' + e.item.title + '"');
              
              if ( e.sectionIndex === 0 ){
                if ( e.itemIndex === 0 ){
                //This call for the menu to be refresh
                  elasticSearch(esURL+"/"+kibannaIndex+queryString,'',
                    function(error, status, request) {
                      console.log(JSON.stringify(error));
                      var errCard = new UI.Card({
                        title:"Error",
                        scrollable:true,
                        subtitle:"Request",
                        body:"Error Looking Up Elastic/Kibanna "+JSON.stringify(error) });
                        errCard.show();
                      msg.text="XXX";
                    },
                  updateMenu);
                }
              }
              else if (e.sectionIndex == 1 ){
                //Do search and display value
                Settings.data("last",e.item.title); //Set last displayed item
                title.text(e.item.title);
                var query = require('standardQuery');
                var aggs_args = Settings.data(e.item.title);
                console.log("Retrieved :-- "+JSON.stringify(aggs_args));

                for ( var i =0; i < aggs_args.length; i ++ ){
                  var obj = {};
                  obj[aggs_args[i].type] = aggs_args[i].params;
                  query.aggs[aggs_args[i].id] = obj;
                }
                
                elasticSearch(esURL+"/"+Settings.option("Index-to-Search")+"/_search",query,
                    function(error, status, request) {
                      msg.text="XXXX";
                      console.log("ES Search Failure: "+JSON.stringify(error));
                    },
                    function(data, status, request) {
                      console.log("Return Data "+JSON.stringify(data.aggregations));
                      msg.text(data.aggregations["1"].value);
                      main.show();
                    });
              }  
});
//Menu End------------------------------


function elasticSearch(query, payload, failure, success){
  var hash = base64.encode(Settings.option("Username")+":"+Settings.option("Password"));
  //console.log("Ajax Authorization Token "+hash);
  console.log("Payload "+JSON.stringify(payload));
  console.log("Ajax url: "+query);

  //Default to POST if we have a payload
  if ( payload ){
    console.log("POST");
    ajax( {
      method:"POST",
      url: query ,
      type: "json",
      headers: {Authorization:"Basic "+hash},
      data:payload||"" },
      success,
      failure
    );
  }else{
    console.log("GET");
    ajax( {
      url: query ,
      type: "json",
      headers: {Authorization:"Basic "+hash}},
      success,
      failure
    );
    
  }
  
}



function updateMenu(data, status, request){
  //console.log('updateMenu Received Payload : ' + JSON.stringify(data));
  
  var vis_section = {};
  vis_section.title="Visualization";
  vis_section.items=[];
  
  if ( status < 400 ){
    var hitsArray = data.hits.hits;
    if ( hitsArray.length > 0 ){
      for ( var i = 0; i < hitsArray.length; i ++){
        var instance = hitsArray[i];
        var visualization = JSON.parse(instance.fields.visState[0]);            
        if ( visualization.type == 'metric' ){
          //console.log("Argg: "+JSON.stringify(visualization.aggs));
          vis_section.items.push({title:instance._id});
          Settings.data(instance._id, visualization.aggs);
        }
      }
    }
    menu.section(1,vis_section);
  }// Should never have a else 
  //console.log("Settings Option:-- "+JSON.stringify(Settings.option()));
  //console.log("Settings data:-- "+JSON.stringify(Settings.data()));
}


//-------------Main --------------------
console.log("Main Start");
if ( !user || !esURL ){
  title.text=("Elastic Search");
  msg.text("?????");
}
else{  
  //Set the title for displaying
  console.log("Attempting to Connect to Elastic Search Onload");
  //Refresh the menu
  elasticSearch(esURL+"/"+kibannaIndex+queryString,'',
    function(error, status, request) {
      console.log(JSON.stringify(error));
      var errCard = new UI.Card({
        title:"Error",
        subtitle:"Request",
        scrollable:true,
        body:"Error Looking Up Elastic/Kibanna "+JSON.stringify(error) });
      errCard.show();
      msg.text("XXX");
    },
    updateMenu);
}
//---------------Main End ----------------



//Event Definition -----------------------
main.on('click', 'up', function(e) {
  console.log("Up Click");
  title.text("Up");
  msg.text("1235467");
});

main.on('click', 'select', function(e) {
  menu.show(); 
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});

//End Event Definition -----------------------
