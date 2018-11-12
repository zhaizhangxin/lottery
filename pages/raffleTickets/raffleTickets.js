// pages/raffleTickets/raffleTickets.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareCord:''
  },
  // 保存图片
  saveImage:function(){
    wx.downloadFile({
      url: this.data.shareCord,
      success:function(res){
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
        })
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '加载中...'
    })
    this.setData({
      shareCord: options.shareCord
    })
    console.log(this.data.shareCord);
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

  }
})