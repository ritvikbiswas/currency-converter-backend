var dbGetter = require("./db");
var DB = {};

const doSomething = async () => {
    //get DB
    try{
        DB = await dbGetter.get();
    }
    catch(err){
        console.log(err);
    }

    //did I get the DB?
    //console.log(DB);
 
    //get the collection
    try{
        var collection = await DB.collection('documents');
    }
    catch(err){
        console.log(err);
    }

       
    //var docs = [{ a: 1 }, { a: 2 }, { a: 3 }];
    
    try{
        var result = await collection.insertMany(docs);
        console.log(result);
    }
    catch(err){
        console.log(err);
    }

};

doSomething();