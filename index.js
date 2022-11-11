const {context: C, SHOW_QUIT_MESSAGE} = require("yellow-machine")
const npm = require('npm-commands')
const {docker} = require('./docker')
const {dgraph} = require('./dgraph')
const config = require("./config")

SHOW_QUIT_MESSAGE.v = true

function test(){
    npm().run('tap');
}

const {up, down} = docker({name: "my-container-dgraph-v13", 
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

