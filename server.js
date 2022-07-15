const express = require("express");
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const couponrouter = require("./routes/couponroute");

mongoose.connect('mongodb://localhost:27017/newdb')
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database Connection Established!')
})

const app = express();
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Connection at ${port}`);
});

app.use('/api', couponrouter)