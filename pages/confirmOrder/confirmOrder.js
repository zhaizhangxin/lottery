// pages/confirmOrder/confirmOrder.js
const reqUrl = require('../../utils/reqUrl');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:null,
    // address:null,
    orderMsg:null,
  },

  /**
   * 事件处理函数
   */

  //获取地址信息
  chooseAddress(e){

    wx.chooseAddress({
      success: res => {
        this.setData({
          'orderMsg.address':res
        })
      }
    })
  },

  //提交订单
  subOrder(e){

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    if(this.data.orderMsg.address == '' || this.data.orderMsg.address == null){
      wx.showToast({
        title: '请完善地址信息',
        icon:'none',
        duration:1000
      })
      return ;
    }

    this.setData({
      'orderMsg.address.id': this.data.options.id,
      'orderMsg.address.form_id':e.detail.formId
    })

    
    wx.request({
      url: reqUrl + 'place',
      header: {
        token: wx.getStorageSync('token')
      },
      data: this.data.orderMsg.address,
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();
        if (res.statusCode == 200) {         

          wx.showToast({
            title: '订单提交成功',
            icon: 'success',
            duration: 600
          })

          setTimeout(function (){
            wx.switchTab({
              url: '../index/index',
            })
          },500)
          

        } else {
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      options: options
    })

    //异步登录执行完的 resolve 
    getApp().login().then(res => {

      wx.hideLoading()

      if (res.statusCode == 200) {

        wx.showLoading({
          title: '加载中...',
          mask: true
        })

        //获取订单详情
        wx.request({
          url: reqUrl + 'order_detail',
          header: {
            token: wx.getStorageSync('token')
          },
          data: {
            id: options.id,
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: res => {

            // console.log(res)

            if (res.statusCode == 200) {
              this.setData({
                orderMsg: res.data.msg
              })

            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                mask: true
              })

              setTimeout(function () {
                wx.switchTab({
                  url: '../me/me',
                })
              }, 1000)
            }

            wx.hideLoading();
          },
          fail: function (res) { },
          complete: function (res) { },
        })

      } else {

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
    return {
      title: '先到先得！口袋喊你大奖一起免费拿',
      path: '/pages/login/login',
    }
  }
})
