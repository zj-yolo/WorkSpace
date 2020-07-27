// components/audio/index.js
Component({
  properties: {
    data: {
      type: Object
    }
  },
  InnerAudioContext: null,
  data: {
    playType: 'pause', //play,pause
  },
  attached() {
    this.init();
  },
  methods: {
    playOrPause() {
      if (this.InnerAudioContext == null) {
        this.init();
        this.data.this.InnerAudioContext.play();
        this.setData({
          playType: 'play'
        })
        return;
      }
      if (this.InnerAudioContext.paused == false) {
        this.InnerAudioContext.pause();
        this.setData({
          playType: 'pause'
        })
      } else {
        this.InnerAudioContext.play();
        this.setData({
          playType: 'play'
        })
      }
    },
    init() {
      if (this.properties.data.imgurl) {
        this.InnerAudioContext = wx.createInnerAudioContext("myAudio")
        this.InnerAudioContext.src = this.properties.data.imgurl;
      }
    }
  }
})