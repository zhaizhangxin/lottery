const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js');

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailMsg:null,

    //url传参
    options:null,

    uid:null,


  },

  //显示商品详情图片
  showImg(e){
    
    var urls = [];
    for (var i in this.data.detailMsg.detail){
      urls[i] = this.data.detailMsg.detail[i].detail_img_url
    }

    wx.previewImage({
      current: e.target.dataset.img, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  //用户参与抽奖
  submit(e) {
    // if (this.data.detailMsg.activity.restrict == 0){
    //   wx.showToast({
    //     title: '不满足该商品抽奖条件，夺得这个大奖，快请好友助力吧',
    //     icon:'none',
    //     mask:true
    //   })

    //   return 
    // }

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //事件触发当前活动id,index
    let id = e.detail.target.dataset.id;
    wx.request({
      url: reqUrl + 'lottery',
      data: {
        id: id,
        form_id: e.detail.formId
      },
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        // console.log(res)
        wx.hideLoading();
        if (res.statusCode === 200) {

          wx.showToast({
            title: '参与成功',
            icon: 'success',
            mask: true
          })


          //点击抽奖显示当前页面分享
          wx.showShareMenu({})

          //添加头像
          var obj = {}
          obj.avatar_url = res.data.msg;
          this.data.detailMsg.avatar.unshift(obj);

          this.setData({
            'detailMsg.activity.participate':2,
            'detailMsg.activity.participants': parseInt(this.data.detailMsg.activity.participants) + 1,
            'detailMsg.avatar': this.data.detailMsg.avatar,
          })

        } else {
          wx.showModal({
            title:'提示',
            showCancel:false,
            content: res.data.msg,
          })

        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  // 点击上报
  click(e) {
    if(this.data.detailMsg.activity.type == 1){

      //调用组件actionSheet的_animationOuter方法
      this.selectComponent('#actionSheet').animationOuter(e.currentTarget.dataset.qr)
      return;
    }

    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    
    wx.request({
      url: reqUrl + 'click',
      data: {
        id: e.currentTarget.dataset.id
      },
      header: {
        token:wx.getStorageSync('token')
      },
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this.setData({
      options:options,
      uid: wx.getStorageSync('uid')
    })


    //获取活动商品详情
    wx.request({
      url: reqUrl + 'detail',
      header: {
        token: wx.getStorageSync('token')
      },
      data:{
        id: options.id
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        // console.log(res)

        if (res.statusCode == 200) {
          this.setData({
            detailMsg: res.data.msg
          })

          //添加倒计时
          let time = Number(res.data.msg.activity.lottery_time) - Math.round(new Date / 1000);
          let countDown = 'detailMsg.activity.lottery_time';

          this.setData({
            [countDown]: formatTime.formatTime(time)
          })

          var interval = setInterval(() => {
            if (Number(time) > 0) {
              time--;
              this.setData({
                [countDown]: formatTime.formatTime(time)
              })

            } else {
              clearInterval(interval);
            }
          }, 1000)

          

          //未点击抽奖，隐藏当前页面分享
          if (this.data.detailMsg.activity.participate != 2) {
            wx.hideShareMenu({});
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

    var arr = [',免费给你个东西敢要吗？', '正在参与口袋夺奖，拜托你为他助力', '在口袋抽奖申请免费试玩，快来帮他助力吧'];
    var i = Math.floor(Math.random() * 3);

    var id = this.data.options.id;
    var uid = this.data.uid;

    return {
      title: wx.getStorageSync('nickName') + arr[i],
      path: '/pages/share/share?id=' + id + '&uid=' + uid,
    }
    
  }
})