module.exports = {
  baseURL: 'https://www.example.com',
  db: {
    host : '127.0.0.1',
    user : 'data',
    database : 'data',
    password : 'secret',
  },
  sanitize: {
    ALLOWED_TAGS: ['h1', 'h2', 'b', 'i', 'em', 'p', 'strong', 'a', 'ul', 'li', '#text'],
    FORBID_TAGS: ['style'],
    FORBID_ATTR: ['style']
  },
  urls: [

  ]
}
