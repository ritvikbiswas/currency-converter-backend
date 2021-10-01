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

/**
 * Helper Functions
 */
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

app.listen(3000, () => console.log("Server is listening on port 3000"));