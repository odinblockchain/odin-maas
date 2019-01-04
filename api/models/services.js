const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    apiVersion: String,
    kind: String,
    metadata:{
        name: String,
        labels:{
            app: String
        }
    },
    spec: {
        ports: [
            {
               "protocol": String,
                "port" : Number,
                "targetPort":String
            }
        ],
        selector:{
                app: String
                },
        'typ': String //See route notes(type) not allowed.
    }
});

module.exports = mongoose.model('Service',serviceSchema)