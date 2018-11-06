// pages/reviewArea/reviewArea.js
var imgArr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: [],
    content:'',
    imgCount:0
  },
  // 评论信息
  input:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  
  // 点击选取照片
  chooseImage: function() {
    var that = this;
    let counts = that.data.img_url.length;
    let count = 9-counts;
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);
        var len = that.data.imgCount + res.tempFilePaths.length;
        if (res.tempFilePaths.length > 0){
          if (len == 9){
            that.setData({
              hideAdd:1
            })
          }else{
            that.setData({
              hideAdd:0
            })
          }
          // 把每次选择的图push到数组
          // let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++){
            imgArr.push(res.tempFilePaths[i])
          }
          that.setData({
            imgCount: len,
            img_url: imgArr
          })
        }


      },
    })
  },

  // 点击上传图片
  missionBtn:function(){
    // console.log(this.data.content);
    // console.log(imgArr);
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    setTimeout(function(){
      wx.hideLoading();
      wx.switchTab({
        url: '../prizes/prizes',
      })
    },1000)
  },
  // 点击取消评论
  cancelBtn:function(){
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