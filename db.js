var mongodb = require('mongo-mock');
mongodb.max_delay = 0;//you can choose to NOT pretend to be async (default is 400ms)

var DB = null;
const DB_NAME = 'myproject';

const setupConnection = async () => {
    var MongoClient = mongodb.MongoClient;
    MongoClient.persist="mongo.js";//persist the data to disk

    // Connection URL
    var url = 'mongodb://localhost:27017/';
    // Use connect method to connect to the Server
    let mongoclient = await MongoClient.connect(url, {});
    let db = mongoclient.db(DB_NAME);

    return db;
};

exports.get = async () => {
    if(!DB) DB = await setupConnection();
    return DB;
};
