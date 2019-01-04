const mongoose = require('mongoose');

const configmapSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    kind: String,
    apiVersion: String,
    metadata: {
        name: String
    },
    data: {
        "odin.conf": String
    }

})
module.exports = mongoose.model('ConfigMap',configmapSchema)