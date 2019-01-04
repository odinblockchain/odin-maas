const mongoose = require('mongoose');

const volumeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    apiVersion: String,
    kind: String,
    metadata:{
        name: String
    },
    spec:{
        accessModes: Array
    },
    resources: {
        requests:{
                    storage: String
        }
        }

});

module.exports = mongoose.model('Volume',volumeSchema)

