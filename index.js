const express = require("express");
const axios = require("axios");
const cors = require("cors");
const qs = require("qs");
const dbGetter = require("./db");

var DB;
const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/fxapi/:date", async (req, res) => {
    console.log("Get Rates!");
    //console.log(req.params.date);
    //console.log(req.query.from);
    const date = req.params.date;
    const from = req.query.from;
    try {
        const rates = await getRates(date, from);
        res.send(rates);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Invalid input. Please check your URL and try again.",
        });
    }
});

app.get("/fxapi/convert/:date", async (req, res) => {
    console.log("Convert!");
    const date = req.params.date;
    const amount = req.query.amount;
    const from = req.query.from;

    try {
        const rates = await convert(date, amount, from);
        res.send(rates);
    } catch (error) {
        //console.log(error);
        res.status(400).send({ message: "Invalid input. Please check" });
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

    try {
        const rates = await average(startDate, endDate, from);
        const objSend = {};
        objSend.base = from;
        objSend.startDate = dupStart.toISOString().slice(0, 10);
        objSend.endDate = endDate.toISOString().slice(0, 10);
        objSend.rates = rates;
        res.send(objSend);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Invalid input. Please check your URL and try again",
        });
    }
});

app.get("/fxapi/upload/:from", async (req, res) => {
    console.log("Upload!");
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);
    const from = req.params.from;
    console.log(startDate);
    console.log(endDate);
    console.log(from);

    try{
        const rates = await upload(startDate, endDate, from);
        res.send(rates);
    }
    catch(err){
        console.log(err);
        res.status(400).send({ message: "Invalid input. Please check your URL and try again"});
    }
});

/**
 * Helper Functions
 */
//Takes as many objects as you want and adds them using reduce - https://stackoverflow.com/a/42488360
function sumObjectsByKey(...objs) {
    return objs.reduce((a, b) => {
        for (let k in b) {
            if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
        }
        return a;
    }, {});
}

const getRates = async (date, from) => {
    console.log("Getting rates...");
    const api_url = "https://api.frankfurter.app/" + date + "?from=" + from; //url to get the rate for the currency in "from"
    //const api_url = "https://edgedev.edgetg.com/";
    console.log(api_url);

    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
        source.cancel();
    }, 5000);

    try {
        const response = await axios.get(api_url, {
            cancelToken: source.token,
        });
        clearTimeout(timeout);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

const convert = async (date, amount, from) => {
    const api_url =
        "https://api.frankfurter.app/" +
        date +
        "?amount=" +
        amount +
        "&from=" +
        from; //url to get the conversion for amount in "amount" and the currency in "from"
    console.log(api_url);

    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
        source.cancel();
    }, 5000);

    try {
        const response = await axios.get(api_url, {
            cancelToken: source.token,
        });
        clearTimeout(timeout);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

const average = async (startDate, endDate, from) => {
    let dateItr = startDate;
    let count = 0;
    let ratesAggregated = {};
    while (dateItr.getTime() <= endDate.getTime()) {
        let dateStr = dateItr.toISOString().slice(0, 10);
        const api_url =
            "https://api.frankfurter.app/" + dateStr + "?from=" + from; //url to get the rate for the currency in "from"
        console.log(api_url);

        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel();
        }, 5000);

        //make req
        try {
            const response = await axios.get(api_url, {
                cancelToken: source.token,
            });
            //console.log(response.data);
            ratesAggregated = sumObjectsByKey(
                ratesAggregated,
                response.data.rates
            );
            count++;
            clearTimeout(timeout);
        } catch (error) {
            throw new Error(error);
        }

        dateItr.setDate(dateItr.getDate() + 1);
    }

    //console.log(ratesAggregated);

    Object.entries(ratesAggregated).forEach(([key, value]) => {
        ratesAggregated[key] = value / count;
    });

    //console.log(ratesAggregated);
    return ratesAggregated;
};

const upload = async (startDate, endDate, from) => {
    var docs = [];
    console.log(`Uploading`);
    //loop through the 'startDate' to 'endDate' amount of dates to upload rates for 'from' to DB
    let dateItr = startDate;
    while (dateItr.getTime() <= endDate.getTime()) {
        let dateStr = dateItr.toISOString().slice(0, 10);
        const api_url =
            "https://api.frankfurter.app/" + dateStr + "?from=" + from; //url to get the rate for the currency in "from"
        console.log(api_url);

        //timeout for severely invalid reqs not handled by API properly
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel();
        }, 5000);

        //make req
        try {
            const response = await axios.get(api_url, {
                cancelToken: source.token,
            });

            //response.data.date = dateStr;
            var doc = {};
            doc.date = dateStr;
            doc.rates = response.data.rates;
            //docs.push(response.data);
            docs.push(doc);
            //console.log(response.data);

            clearTimeout(timeout);
        } catch (error) {
            throw new Error(error);
        }

        dateItr.setDate(dateItr.getDate() + 1);
    }

    //get DB and collection
    try{
        DB = await dbGetter.get();
        var collection = await DB.collection('documents');
        var result = await collection.insertMany(docs);
        console.log(result);
    }
    catch(err){
        console.log(err);
    }

    //docs is array of objs => make into object and return
    // return Object.fromEntries(docs);
    const arrToObj = (arr, key) => {
        return arr.reduce((obj, item) => {
            obj[item[key]] = item;
            return obj;
        }, {});
    }

    return arrToObj(docs, 'date');
};

const port = process.env.PORT || 3000;
var server = app.listen(3000, "localhost", () =>
    console.log("Server is listening on port " + server.address().port)
);
