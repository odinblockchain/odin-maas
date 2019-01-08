const Masternode = require('../models/volumes')
const mongoose = require('mongoose');
const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config
//const client = new Client({ config: config.fromKubeconfig(), version: '1.9' })

exports.masternodes_get_all = async (req, res) => {

    try {
        const client = new Client({ config: config.fromKubeconfig(), version: '1.9' })
        const pd = await client.api.v1.namespaces('default').pods.get()
console.log(pd)
        // Pod with single container
    ////    let res = await client.api.v1.namespaces('default').pods('axe-75d5447544-vjs85').exec.post({
       //   qs: {
    //        command: ['ls', '-al'],
      //      stdout: true,
 //           stderr: true
    //      }
    //    }).then(
    //        token => { return token }
    //    )
        console.log(res.body)
        console.log(res.messages)
      } catch (err) {
        console.error('Error: ', err)
      }
}