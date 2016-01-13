# EK Viewer
This is a pebble app that expose a small portion of Kibana visualization to the pebble watch using purely the PebbleJS.
This app access the kibana index of the elastic search and look for saved METRIC visualization and display that reporting on your pebble watch. 
The time frame is currently fixed at now - 15 minutes.

Upon launching the app, it will refresh the list of available visualization. Use select to selct the metric visualization to be displayed. 

Currently only display Metric with Single returned value, ie Sum, Count, Avg etc

You will need to provide
1. User Authoriation 
2. Elastic Search URL. (Please use HTTPS)
3. Like with Kibana, the index pattern to perform the search on.

Application is tested to work on ElasticSearch Cloud hosted in Found.

Future Release will include:
- Improved Display format
- Customizable Search Time-Frame
- AutoRefresh/Updates

Still thinking
- Charting? Is it a good idea in such small screen?
- Scrolling