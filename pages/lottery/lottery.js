// pages/lottery/lottery.js
const reqUrl = require('../../utils/reqUrl');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailMsg: null,

    //url传参
    options: null,
    detailMask:true

  },
  // 点击上报
  click(e) {
    if (e.currentTarget.dataset.path) {
      let url = encodeURIComponent(e.currentTarget.dataset.path);
      wx.navigateTo({
        url: '../h5ad/h5ad?h5ad=' + url
      })
    }
    // if (this.data.detailMsg.activity.type == 1) {
    //   //调用组件actionSheet的_animationOuter方法
    //   this.selectComponent('#actionSheet').animationOuter(e.currentTarget.dataset.qr)
    //   return;
    // }

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this;
    wx.request({
      url: reqUrl + 'award_click',
      data: {
        id: e.currentTarget.dataset.id
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (e.currentTarget.dataset.qr != '') {
          var url = e.currentTarget.dataset.qr;
          var imgArr = [];
          imgArr.push(url);
          wx.previewImage({
            current: imgArr[0], // 当前显示图片的http链接 
            urls: imgArr // 需要预览的图片http链接”列表“ 
          });
        }
        wx.hideLoading();
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
// 点击关闭弹窗
  detailExit:function(){
    this.setData({
      detailMask:false
    })
  },
  // 一键复制
  detaGroup: function (e) {
    var detaGroup = e.target.dataset.href;
    wx.setClipboardData({
      data: detaGroup,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res);
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this.setData({
      options: options
    })


    //异步登录执行完的 resolve 
    getApp().login().then(res => {

      
      if (res.statusCode == 200) {
        var that = this;
        //获取开奖信息
        wx.request({
          url: reqUrl + 'award_run_lottery',
          header: {
            token: wx.getStorageSync('token')
          },
          data: {
            id: options.id
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: res => {
            // console.log(res)

            if (res.statusCode == 200) {
              that.setData({
                detailMsg: res.data.msg
              })
              if (res.data.msg.product.is_luck != 1){
                  that.setData({
                    detailMask:true
                  })
              }else{
                that.setData({
                  detailMask: false
                })
              }

            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask: true
              })

            }

            wx.hideLoading();
          },
          fail: function (res) { },
          complete: function (res) { },
        })

        // console.log(appid);

        wx.request({
          url: 'https://api.koudaihaiwan.com/putPlatformUserData',
          data: {
            scene: options.scene,
            openid: res.data.key,
            from_appid: appid,
            query: options.query
          },
          method: 'POST',
          success: res => {
            console.log(res)
          }
        })


      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })

      }

    })


    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var id = this.data.options.id
    return {
      title: '先到先得！口袋喊你大奖一起免费拿',
      path: '/pages/share/share?id=' + id + '&uid=' + wx.getStorageSync('uid'),
    }


  }
})
