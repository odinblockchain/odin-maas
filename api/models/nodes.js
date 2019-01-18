const mongoose = require('mongoose');

const nodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    hostname: String,
    name: String,
    rpcuser: String,
    rpcpassword: String,
    nodeip: String,
    nodeprivkey: String,
    configpath: String,
    allocated: Boolean
})
module.exports = mongoose.model('Node',nodeSchema)