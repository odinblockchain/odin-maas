const RpcClient = require('node-json-rpc2').Client;
var dotConf = require("@sim.perelli/dot-conf")
var odinRpc = "";

async function getconfigs(path) {
  const s = await dotConf(path)
  var user = s('rpcuser')
  var password = s('rpcpassword')

  const RpcConfig = {
    user: user,
    password: password,
    port: 1988
  }
  return RpcConfig
 }

exports.getInfo = function (req, res) {
  odinRpc.call({
    method: 'getinfo'
  }, (err, result) => {
    if (err) { res.send(err); }
    try {
      res.send({ body: result.result })
    } catch (e) {
      res.send(e)
    }
  })
}

exports.getMasternodeStatus = async function (req, res) {
   getconfigs(req.body.configpath)
  .then(docs => {
    odinRpc = new RpcClient(docs)
  odinRpc.call({
    method: 'getmasternodestatus'
  }, (err, result) => {
    if (err) {
      res.status(500).json({
        error: err.message + ". Most likely not a masternode"
      })
    }
    res.status(200).json({ body: result.result })
  })
})
  .catch(err => {
    res.status(500).json(err.message) 
  })

}

exports.getMasternodeList = function (req, res) {
  odinRpc.call({
    method: 'masternode',
    params: ["list"]
  }, (err, result) => {
    if (err) {
      res.status(500).json({
        error: err.message
      })
    }
    res.send({ body: result.result })
  })
}
exports.getMasternodePrivateKey = function (req, res) {
  odinRpc.call({
    method: 'masternode',
    params: ["genkey"]
  }, (err, result) => {
    if (err) {
      res.status(500).json({
        error: err.message
      })
    }
   // res.send({ body: result.result })
  })
  return result.result
}