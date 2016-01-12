/*This represent a standard elastic search query 
To use this query, require it and overide the properties and send the object
as the post content.
*/

exports=module.exports=
{
  "size": 0,
  "aggs": {},
  "query": {
    "filtered": {
      "query": {
        "query_string": {
          "query": "*"
        }
      },
      "filter": {
        "bool": {
          "must": [
            {
              "range": {
                "@timestamp": {
                  "gte": "now-15m/m",
                  "format": "epoch_millis"
                }
              }
            }
          ],
          "must_not": []
        }
      }
    }
  }
};