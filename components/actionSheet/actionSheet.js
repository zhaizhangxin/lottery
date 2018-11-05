// components/actionSheet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // animationStatus:{
    //   type:Boolean,
    //   value:false
    // },
    // animationUrl:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    
    anmiation:"",
    animationStatus:false,
    animationUrl: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //actionSheet进场动画
    animationOuter(e){
      this.setData({
        animationStatus: true,
        animationUrl: e
      })

      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "ease-out",
        transformOrigin: "100%",
      })

      animation.height(275).step();

      this.setData({
        animation: animation.export(),
      })
    },


    //actionSheet出场动画
    _animationInner(e) {

      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "ease-in",
        transformOrigin: "100%",
      })

      animation.height(0).step();

      this.setData({
        animation: animation.export(),

      })

      setTimeout(() => {
        this.setData({
          animationStatus: false
        })
      }, 300)

    },

    //显示跳转二维码
    _showQrCode() {
      wx.previewImage({
        current: this.data.animationUrl, // 当前显示图片的http链接
        urls: [this.data.animationUrl] // 需要预览的图片http链接列表
      })
    },
  }
})
