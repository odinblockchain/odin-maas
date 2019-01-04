const mongoose = require('mongoose');

const deploymentSchema = mongoose.Schema({
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
        replicas:Number,
        selector: {
            matchLabels: {
                app: String
                         }},
        template: {
          metadata:{
            labels: {
              app: String
            }
        },
            spec:{
                containers:[{
                    name: String,
                    image: String,
                    command: Array,
                    ports:[{
                        containerPort:Number
                    }
                    ],
                    volumeMounts:[
                        {
                            mountPath: String,
                            name: String
                        },
                        {
                        name: String,
                        mountPath: String
                    }
                    ]
                }
                ],
                volumes:[{
                    name: String,
                    configMap:{
                        name: String,
                        items:[
                            {
                                key:String,
                                path: String
                            }
                        ]
                    }
                },
                {
                    name: String,
                    persistentVolumeClaim: {
                        claimName:String
                    }
                }
                ]
            }

}   
    }
});

module.exports = mongoose.model('Deployment',deploymentSchema)