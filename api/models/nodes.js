const mongoose = require('mongoose');

const nodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    rpcuser: String,
    rpcpassword: String,
    nodeip: String,
    nodeprivkey: String,
    allocated: Boolean
})
module.exports = mongoose.model('Node',nodeSchema)