var path = require('path');
module.exports = {

  colors: true,

  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.js']
  },
  devServer : {
    contentBase : '../'
  }
};