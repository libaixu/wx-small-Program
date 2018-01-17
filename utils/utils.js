function coverTostarArray(stars) {
  var num = stars.toString().substring(0, 1);
  var arr = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      arr.push(1)
    } else {
      arr.push(0)
    }
  }
  return arr;
}
function coverToCastInfo(casts) {
  var castArray = [];
  for (var index in casts) {
    var cast = {
      image: casts[index].avatars ? casts[index].avatars.large : '',
      name: casts[index].name
    }
    castArray.push(cast);
  }
  return castArray;
}

function coverToCastString(casts) {
  var castjoin = '';
  for (var index in casts) {
    castjoin = castjoin + casts[index].name + '/';
  }
  // return castjoin;
  return castjoin.substring(0, castjoin.length - 1);
}
function http(url, callback) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Content-type': 'json'
    },
    success: function (res) {
      callback(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

module.exports = {
  coverTostarArray: coverTostarArray,
  http: http,
  coverToCastInfo: coverToCastInfo,
  coverToCastString: coverToCastString
}