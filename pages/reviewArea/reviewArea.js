// pages/reviewArea/reviewArea.js
const reqUrl = require('../../utils/reqUrl');

var imgArr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: [],
    content: '',
    imgCount: 0,
    productInfo: [],
    missionBtn: false,
  },
  // 评论信息
  input: function(e) {
    this.setData({
      content: e.detail.value
    })
  },

  // 点击选取照片
  chooseImage: function() {
    var that = this;
    let counts = that.data.img_url.length;
    let count = 9 - counts;
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);
        var len = that.data.imgCount + res.tempFilePaths.length;
        if (res.tempFilePaths.length > 0) {
          if (len == 9) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
          // 把每次选择的图push到数组
          // let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            imgArr.push(res.tempFilePaths[i])
          }
          that.setData({
            imgCount: len,
            img_url: imgArr,
            tempFiles: res.tempFiles
          })
        }


      },
    })
  },

  // 点击上传图片
  missionBtn: function() {
    var that = this;
    console.log(that.data.content);
    console.log(imgArr.length);
    if (that.data.content == '' || imgArr.length == 0) {
      wx.showToast({
        title: '请填写评论',
        icon:'none',
        mask:true
      })
    } else {
      that.setData({
        missionBtn: true
      })

      wx.showLoading({
        title: '上传中...',
        mask: true
      })
      if (imgArr.length != 0){
        var uploadImgCount = 0;
        for (let i = 0; i < imgArr.length; i++) {
          wx.uploadFile({
            url: reqUrl + 'award_upload',
            method: 'POST',
            filePath: imgArr[i],
            name: 'file',
            header: {
              token: wx.getStorageSync('token'),
              'content-type': 'multipart/form-data'
            },
            success: res => {
              uploadImgCount++;
              var data = JSON.parse(res.data);
              console.log(data);
              var productInfo = that.data.productInfo;
              productInfo.push(data.msg)
              that.setData({
                productInfo: productInfo
              })
              if (uploadImgCount == imgArr.length) {
                // wx.hideLoading();

                that.award_remake();
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: res.data.msg,
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
              that.setData({
                missionBtn: true
              })
            },
            complete: function (res) { },
          })
        }
      }else{
        // wx.hideLoading();
        that.award_remake();
      }
     
    }
  },
  // 上传评论
  award_remake: function() {
    var that = this;
    console.log(that.data.productInfo);
    wx.request({
      url: reqUrl + 'award_remake',
      method: 'POST',
      data: {
        text: that.data.content,
        imgArr: that.data.productInfo
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.error_code == 0) {
          wx.switchTab({
            url: '../prizes/prizes',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            mask:true
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击取消评论
  cancelBtn: function() {
    wx.switchTab({
      url: '../prizes/prizes',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    imgArr = [];
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})