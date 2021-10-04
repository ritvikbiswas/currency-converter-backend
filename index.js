const express = require('express');
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');
const app = express();

app.use(cors({
    origin: '*'
}));


app.get("/", (req, res) => { 
    res.send("Hello World!");
});

app.get("/fxapi/:date", async (req, res) => {
    console.log("Get Rates!");
    //console.log(req.params.date);
    //console.log(req.query.from);
    const date = req.params.date;
    const from = req.query.from;
    try{
        const rates = await getRates(date, from);
        res.send(rates);
    }
    catch(error){
        res.status(400).send({message: "Invalid input. Please check your URL and try again."});
    }
});

app.get("/fxapi/convert/:date", async (req, res) => {
    console.log("Convert!");
    const date = req.params.date;
    const amount = req.query.amount;
    const from = req.query.from;

    try{
        const rates = await convert(date, amount, from);
        res.send(rates);
    }
    catch(error){
        //console.log(error);
        res.status(400).send({message: "Invalid input. Please check"});
    }
});

app.get("/fxapi/average/:from", async (req, res) => {
    console.log("Average!");
    const startDate = new Date(req.query.start);
    const dupStart = new Date(startDate);
    const endDate = new Date(req.query.end);
    const from = req.params.from;
    //console.log(startDate);
    //console.log(endDate);
    //console.log(from);

    try{
        const rates = await average(startDate, endDate, from);
        const objSend = {};
        objSend.base = from;
        objSend.startDate = dupStart.toISOString().slice(0,10);
        objSend.endDate = endDate.toISOString().slice(0,10);
        objSend.rates = rates;
        res.send(objSend);
    }
    catch(error){
        console.log(error);
        res.status(400).send({message: "Invalid input. Please check your URL and try again"});
    }
    
});

/**
 * Helper Functions
 */
//Takes as many objects as you want and adds them using reduce - https://stackoverflow.com/a/42488360
 function sumObjectsByKey(...objs) {
    return objs.reduce((a, b) => {
      for (let k in b) {
        if (b.hasOwnProperty(k))
          a[k] = (a[k] || 0) + b[k];
      }
      return a;
    }, {});
}

const getRates = async (date, from) => {
    const api_url = "https://api.frankfurter.app/" + date + "?from=" + from; //url to get the rate for the currency in "from"
    console.log(api_url);
    try{
        const response = await axios.get(api_url);
        return response.data;
    }
    catch(error){
        throw new Error(error);
    }
};

const convert = async (date, amount, from) => {
    const api_url = "https://api.frankfurter.app/" + date + "?amount=" + amount + "&from=" + from; //url to get the conversion for amount in "amount" and the currency in "from"
    console.log(api_url);
    try{
        const response = await axios.get(api_url);
        return response.data;
    }
    catch(error){
        throw new Error(error);
    }
}

const average = async (startDate, endDate, from) => {
    let dateItr = startDate;
    let count = 0;
    let ratesAggregated = {};
    while(dateItr.getTime() <= endDate.getTime()){
        let dateStr = dateItr.toISOString().slice(0,10);
        const api_url = "https://api.frankfurter.app/" + dateStr + "?from=" + from; //url to get the rate for the currency in "from"
        console.log(api_url);

        //make req
        try{
            const response = await axios.get(api_url);
            //console.log(response.data);
            ratesAggregated = sumObjectsByKey(ratesAggregated, response.data.rates);
            count++;
        }
        catch(error){
            throw new Error(error);
        }

        dateItr.setDate(dateItr.getDate() + 1);
    }

    //console.log(ratesAggregated);

    Object.entries(ratesAggregated).forEach(([key, value]) => {
        ratesAggregated[key] = value/count;
    });

    //console.log(ratesAggregated);
    return ratesAggregated;
}

app.listen(3000, () => console.log("Server is listening on port 3000"));
