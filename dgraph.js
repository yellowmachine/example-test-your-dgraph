const axios = require('axios')
const fs = require('fs')
const path = require('path')

async function loadSchema(name){
    let data = await fs.promises.readFile(name, 'utf8')
    data =  data.toString()
    let lines = data.split("\n")
    let i = 0
    let line = lines[i]
    let header = ""
    while(line.startsWith("#include")){
      header = header + await loadSchema(path.join(path.dirname(name), line.substring(9).trim())) + "\n"
      i += 1
      line = lines[i]
    }
    return header + data
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.dgraph = async function(url, name){
    if(name.endsWith(".js")) data = require(name)
    else data = await loadSchema(name)
    
    //data = data + config.schemaFooter(config)
    const schema = data.toString()

    console.log(schema)

    while(true){        
        console.log('inside while true')
        let response = await axios({
          url,
          method: 'post',
          data: {
            query: `mutation($schema: String!) {
              updateGQLSchema(input: { set: { schema: $schema } }) {
                gqlSchema {
                  schema
                }
              }
            }
            `,
            variables: {
              schema,
            },
          },
        })

        if(!response.data.errors){
          break
        }

        if(!response.data.errors[0].message.startsWith('failed to lazy-load GraphQL schema')){
            console.log(response.data.errors[0].message)
            //throw new Error('')
        }
        await sleep(2000)
    }
}