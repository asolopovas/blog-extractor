const { Model } = require('objection');
const Knex = require('knex');
const {db} = require('../config')

// Initialize knex.
var knex = require('knex')({
  client: 'mysql',
  connection:db
});

Model.knex(knex);

class Post extends Model {
  static get tableName() {
    return 'posts';
  }
}

async function main(data) {
  const post =  await Post.query().insertGraph(data)
}



module.exports = main
