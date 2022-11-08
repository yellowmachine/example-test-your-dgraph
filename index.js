const {pipe, pwatch} = require("yellow-machine")
const npm = require('npm-commands')
const {docker} = require('./docker')
const {dgraph} = require('./dgraph')
const config = require("./config")

function test(){
    npm().run('test');
}

const {up, down} = docker({name: "my-container-dgraph-v6", 
                           image: "dgraph/standalone:master", 
                           port: "8080", 
                           waitOn: "http://localhost:8080"
                        })

async function main() {
    await pipe([up, 
                [pwatch(["./tests/*.js", "./schema/*.*"], 
                    [
                        dgraph(config), 
                        test
                    ]), 
                 down
                ]
            ])
}

main()

