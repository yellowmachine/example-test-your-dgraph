const { gql } = require('graphql-request');

function quote(txt){
    return `\\"${txt}\\"`
}

module.exports = {
    quote,
    gql
}