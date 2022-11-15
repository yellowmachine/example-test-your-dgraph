# example testing dgraph schemas

Based on [yellow-machine pipeline](https://github.com/yellowmachine/yellow-machine#readme)

```js
const {context: C, watch, SHOW_QUIT_MESSAGE} = require("yellow-machine")
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

const dql = dgraph(config)

async function main() {
    const {serial} = C({up, dql, test, down}, {w: watch(["./tests/*.js", "./schema/*.*"])});
    await serial(`up[
                      w[ dql? | test ]
                      down`
    )();
}

main()
```