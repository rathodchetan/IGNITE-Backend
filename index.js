const express = require('express');

const app = express();
const routes = require('./routes/route.js');

require('dotenv').config();


app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})