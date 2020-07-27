Page({

  data: {
    skipUrl: ''
  },

  onLoad: function (options) {
    let url = decodeURIComponent(options.url);
    this.setData({
      skipUrl: url
    })
  },
})