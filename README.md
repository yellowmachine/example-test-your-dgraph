# example testing dgraph schemas

Based on [yellow-machine pipeline](https://github.com/yellowmachine/yellow-machine#readme)

```js
const {pipe, pwatch} = require("yellow-machine")
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

```