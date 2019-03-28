var promfig = require('promfig')
  , Github = require('github');
  
module.exports = getGithubToken



function getGithubToken(scopes, note, noteUrl, github, ready) {
  if(!ready) {
    ready = github

    github = new Github({
        version: '3.0.0'
      , protocol: 'https'
    })
  }
  promfig({
      username: 'username: '
    , password: 'password: '
    , '@secret': 'password'
  }, {}, onlogin);

  function onlogin(err,config) {
    if(err) {
      return ready(err)
    }
    console.log(" --------");
    console.log(config);
    console.log(" ------=====--");
    github.authenticate({
        type: 'basic'
      , username: config.username
      , password: config.password
    })

    attempt(null)

    function attempt(headers) {
      github.authorization.create({
          note: note
        , scopes: scopes
        , note_url: noteUrl
        , headers: headers
      }, onready)
    }

    function onreattempt(err, config) {
      if(err) {
        return ready(err)
      }

      attempt({'X-GitHub-OTP': config.twofactor})
    }

    function onready(err, res) {
      if(err && /OTP/.test(err.message)) {
        return promfig({
            'twofactor': 'Two Factor Code: '
        }, {}, onreattempt)
      }

      if(err) {
        return ready(err)
      } 
      return ready(err,{"token":res.token,"user":config.username})
    }
  }
}
