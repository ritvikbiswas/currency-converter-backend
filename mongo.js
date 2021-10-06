var ObjectID = require('bson-objectid');

module.exports = {
  "localhost:27017": {
    "databases": {
      "": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": []
          }
        ]
      },
      "myproject": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              },
              {
                "name": "documents"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": [
              {
                "v": 1,
                "key": {
                  "_id": 1
                },
                "ns": "myproject.documents",
                "name": "_id_",
                "unique": true
              }
            ]
          },
          {
            "name": "documents",
            "documents": [
              {
                "a": 1,
                "_id": ObjectID("615de1502323134794b2314a")
              },
              {
                "a": 2,
                "_id": ObjectID("615de1502323134794b2314b")
              },
              {
                "a": 3,
                "_id": ObjectID("615de1502323134794b2314c")
              }
            ]
          }
        ]
      }
    }
  }
}