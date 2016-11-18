var express = require('express');
var router = express.Router();
var request = require('request');

const url = 'https://graph.facebook.com/';

var options = {
  url: url + process.env.WORKPLACE_COMMUNITY_ID + '/members?limit=200&access_token=' + process.env.WORKPLACE_ACCESS_TOKEN,
  method: 'GET',
  headers: {'Content-Type':'application/json'}
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      bodystr = JSON.parse(decodeURIComponent(body));
      res.json(bodystr);
      console.log(bodystr.data);
    }
  });

});

/* GET user's impersonate_token. */
router.get('/:name', function(req, res, next) {
  getPersonateToken(req, res).then (
    function(bodystr) {
      res.json(bodystr);
    },
    function() {
      res.json('failed');
    }
  );
});

function getPersonateToken (req, res) {
  return new Promise(function(resolve, reject) {
    uname = decodeURIComponent(req.params.name);

    //membersエンドポイントを実行し、特定メンバのIDを取得
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        bodystr = JSON.parse(decodeURIComponent(body));
        
        //filterで特定配列のみ取得
        var filtered = bodystr.data.filter(function(element, index, array) {
          return (element.name == uname);
        });

        memberid = filtered[0].id;

        var options_token = {
          url: url + memberid + '?fields=impersonate_token&access_token=' + process.env.WORKPLACE_ACCESS_TOKEN,
          method: 'GET',
          headers: {'Content-Type':'application/json'}
        }

        request(options_token, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            bodystr = JSON.parse(decodeURIComponent(body));
            //res.json(bodystr);
            //console.log(bodystr.impersonate_token);
            resolve(bodystr);
          } else {
            reject();
          }
        });
      }
    });

  });
};


module.exports = router;
