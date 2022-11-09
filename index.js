const {context: C} = require("yellow-machine")
const npm = require('npm-commands')
const {docker} = require('./docker')
const {dgraph} = require('./dgraph')
const config = require("./config")

function test(){
    npm().run('tap');
}

const {up, down} = docker({name: "my-container-dgraph-v6", 
                           image: "dgraph/standalone:master", 
                           port: "8080"
                        })

async function main() {
    const {serial, w} = C();
    await serial([up, 
                [w(["./tests/*.js", "./schema/*.*"], 
                    [
                        dgraph(config), 
                        test
                    ]), 
                 down
                ]
            ])
}

main()

