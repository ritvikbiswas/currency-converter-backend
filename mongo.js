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
                "date": "2010-10-10",
                "rates": {
                  "AUD": 1.0272,
                  "BGN": 1.4097,
                  "BRL": 1.6862,
                  "CAD": 1.0212,
                  "CHF": 0.96728,
                  "CNY": 6.6706,
                  "CZK": 17.6517,
                  "DKK": 5.3742,
                  "EEK": 11.2776,
                  "EUR": 0.72077,
                  "GBP": 0.63075,
                  "HKD": 7.7585,
                  "HRK": 5.2741,
                  "HUF": 198.61,
                  "IDR": 8933,
                  "INR": 44.425,
                  "JPY": 82.32,
                  "KRW": 1128.71,
                  "LTL": 2.4887,
                  "LVL": 0.5111,
                  "MXN": 12.5657,
                  "MYR": 3.1152,
                  "NOK": 5.8383,
                  "NZD": 1.3405,
                  "PHP": 43.483,
                  "PLN": 2.8662,
                  "RON": 3.0736,
                  "RUB": 29.979,
                  "SEK": 6.7154,
                  "SGD": 1.3117,
                  "THB": 30.063,
                  "TRY": 1.4258,
                  "ZAR": 6.9188
                },
                "_id": ObjectID("615dff915cae3b205c28e538")
              }
            ]
          }
        ]
      }
    }
  }
}