var express = require('express');
var router = express.Router();
var request = require('request');

const url = 'https://graph.facebook.com/';

var options = {
  url: url + process.env.WORKPLACE_COMMUNITY_ID + '/groups?limit=200&access_token=' + process.env.WORKPLACE_ACCESS_TOKEN,
  method: 'GET',
  headers: {'Content-Type':'application/json'}
}

/* GET groups listing. */
router.get('/', function(req, res, next) {

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      bodystr = JSON.parse(decodeURIComponent(body));
      res.json(bodystr);
      console.log(bodystr);
    }
  });

});

/* GET group's id. */
router.get('/:groupname', function(req, res, next) {
  groupname = decodeURIComponent(req.params.groupname);

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      bodystr = JSON.parse(decodeURIComponent(body));

      //filterで特定配列のみ取得
      var filtered = bodystr.data.filter(function(element, index, array) {
          return (element.name == groupname);
      });

      res.json(filtered[0]);
      console.log(filtered[0]);
    }
  });

});

/* POST Post a message to group */
router.post('/:groupid/feed', function (req, res) {

  accesstoken = req.body.impersonate_token;

  options_post = {
      url: url + req.params.groupid + '/feed?message=' + req.body.message + '&access_token=' + accesstoken,
      method: 'POST',
      headers: {'Content-Type':'application/json'}
  }

  request.post(options_post, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      bodystr = JSON.parse(decodeURIComponent(body));
      res.json(bodystr);
      console.log(bodystr);
    }
  });
});

module.exports = router;
