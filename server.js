require('dotenv').config();
const express = require('express'),
      bodyParser = require('body-parser'),      
      cors = require('cors'),
      config = require('config'),
      mongoose = require('mongoose');

const httpHandler = require('./routes/http-handlers');

const app = express();
const PORT = process.env.PORT || config.get('port') || 3000;

app.use(express.static(__dirname + '/public'));
// app.use(express.urlencoded());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.raw({limit: '5mb'}));

app.use(bodyParser.urlencoded({ 
    limit: '5mb',
    extended: true 
}));

app.use(cors());
app.use(httpHandler);

// here...
async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        app.listen(PORT, () => {
            console.log(`Server has been started onport ${PORT}...`);
        });
    } catch (e) {
        console.log(e.stack);
        process.exit(1);
    }
}

start();






