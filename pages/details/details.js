const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js');

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailMsg: null,
    showModalStatus: false,
    shareAvatarStatus:false,
    rankingStatus:false,
    sponsor_id:'',
    //url传参
    options: null,
    uid: null,


  },
  // 回到首页
  swithTab: function() {
    wx.switchTab({
      url: '../indexs/indexs',
    })
  },
  // 获取参与者头像
  award_avater: function() {
    var that = this;
    wx.request({
      url: reqUrl + 'award_avatar',
      method:'GET',
      data: {
        id: this.data.id,
        page: 1
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res);
        that.setData({
          avatarImg:res.data.msg
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 点击显示参与人数
  avatarPic: function() {
    this.award_avater();
    this.setData({
      showModalStatus: true
    })
  },
  // 点击关闭人数
  exitTop: function() {
    this.setData({
      showModalStatus: false
    })
  },

  // 获取我邀请的朋友
  award_shareAvatar:function(){
    var that = this;
    wx.request({
      url: reqUrl + 'award_shareAvatar',
      method: 'GET',
      data: {
        user_id: wx.getStorageSync('uid'),
        id: this.data.id,
        page: 1,
        rows:40
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res);
        that.setData({
          shareImg: res.data.msg,
          dragonball: res.data.msg.dragonball,
          restrict: res.data.msg.restrict
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 点击显示我邀请的朋友
  shareAvatar: function () {
    this.setData({
      shareAvatarStatus: true
    })
    this.award_shareAvatar();
  },
  // 点击关闭我邀请的朋友
  shareAvatarTop: function () {
    this.setData({
      shareAvatarStatus: false
    })
  },
  // 邀请排名
  rankAvater:function(){
    var that = this;
    wx.request({
      url: reqUrl + 'award_shareRank',
      method: 'GET',
      data: {
        id: this.data.id
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res);
        that.setData({
          avatarUrl: res.data.msg.rankList
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 点击查看排名
  ranking:function(){
    this.setData({
      rankingStatus: true
    })
    this.rankAvater();
    
  },
  // 点击关闭邀请排名
  rankingTop:function(){
    this.setData({
      rankingStatus: false
    })
  },
  // 点击抽奖
  luckDraw:function(e){
    var that = this;
    wx.request({
      url: reqUrl + 'award_lottery',
      method: 'POST',
      data: {
        id: this.data.id,
        form_id: e.detail.formId,
        sponsor_id: this.data.sponsor_id
      },
      header: {
        token: wx.getStorageSync('token')
      },
      success: res => {
        console.log(res);
        if (res.data.error_code == 0){
          if (res.data.msg.product_type == 1){
            var luckPic = { avatar_url: res.data.msg };
            let user_Pic = that.data.detaPic;
            user_Pic.unshift(luckPic);
            that.setData({
              detaPic: user_Pic
            })
          }
          that.setData({
            'detailMsg.activity.participate':2
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //显示商品详情图片
  showImg(e) {

    var urls = [];
    for (var i in this.data.detailMsg.detail) {
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
            'detailMsg.activity.participate': 2,
            'detailMsg.activity.participants': parseInt(this.data.detailMsg.activity.participants) + 1,
            'detailMsg.avatar': this.data.detailMsg.avatar,
          })

        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg,
          })

        }

      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  // 点击上报
  click(e) {
    console.log(222);
    if (this.data.detailMsg.activity.type == 1) {

      //调用组件actionSheet的_animationOuter方法
      this.selectComponent('#actionSheet').animationOuter(e.currentTarget.dataset.qr)
      return;
    }

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.request({
      url: reqUrl + 'click',
      data: {
        id: e.currentTarget.dataset.id
      },
      header: {
        token: wx.getStorageSync('token')
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
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this.setData({
      id: options.id,
      options: options,
      uid: wx.getStorageSync('uid')
    })


    //获取活动商品详情
    wx.request({
      // url: reqUrl + 'detail',
      url: reqUrl + 'award_detail',
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
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.msg.product_type == 1){
            this.setData({
              detaPic: res.data.msg.avatar
            })
          }
          this.setData({
            detailMsg: res.data.msg
          })

          //添加倒计时
          let time = Number(res.data.msg.activity.time) - Math.round(new Date / 1000);
          let countDown = 'detailMsg.activity.time';

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
      fail: function(res) {},
      complete: function(res) {},
    })
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

    var arr = [',免费给你个东西敢要吗？', '正在参与口袋夺奖，拜托你为他助力', '在口袋抽奖申请免费试玩，快来帮他助力吧'];
    var i = Math.floor(Math.random() * 3);

    var id = this.data.options.id;
    var uid = this.data.uid;

    return {
      title: wx.getStorageSync('nickName') + arr[i],
      path: '/pages/share/share?id=' + id + '&uid=' + uid,
      success:res=>{
        // console.log(res.errMsg);
        // if (res.errMsg == "shareAppMessage:ok"){
        //     this.setData({
        //       'detailMsg.activity.participate':2
        //     })
        // }
      },
      fail: function (res) { 
        wx.showToast({
          title: '转发失败，请重试',
        })
      }
    }

  }
})