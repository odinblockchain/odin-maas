const mongoose = require('mongoose');

const nodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    ipaddress: String,
    mnprivkey: String,
    allocated: Boolean
})
module.exports = mongoose.model('Node',nodeSchema)