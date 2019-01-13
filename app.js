const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./api/config/db');
const volumeRoutes = require('./api/routes/volumes');
const serviceRoutes = require('./api/routes/services');
const deploymentRoutes = require('./api/routes/deployments');
const configmapRoutes = require('./api/routes/configmaps');
const masternodeRoutes = require('./api/routes/masternodes');
const rpcRoutes = require('./api/routes/rpc');

mongoose.connect(db.url,({
     useNewUrlParser: true 
}))

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type,Accept,Authorization"
    );
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next();
});
app.use ('/volumes',volumeRoutes);
app.use ('/services',serviceRoutes);
app.use ('/deployments',deploymentRoutes);
app.use ('/configmaps',configmapRoutes);
app.use('/masternodes',masternodeRoutes);
app.use('/rpc',rpcRoutes);

app.use((req,res,next) => {
const error = new Error('Not found');
error.status = 404;
next(error);

})
app.use((error,req,res,next) =>{

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })

})

module.exports = app;