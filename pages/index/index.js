const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

//index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //滚动消息
    rollMsg:'',

    //活动信息
    // activityMsg: [{ start_time: 1532998490,is_make:2,status:1}],
    activityMsg:[
      // { lottery_time:"11:11:11"  },
      // { lottery_time: "11:11:11" },
      // { lottery_time: "11:11:11" },
      // { lottery_time: "11:11:11" },
      // { lottery_time: "11:11:11" },
      // { lottery_time: "11:11:11" },

    ],

    // page:1,
    // pageStatus:true,

    //倒计时
    interval:'',
  },


  /**
   * 事件处理函数
   */
  
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    //获取滚动消息
    wx.request({
      url: reqUrl + 'roll',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();
        if (res.statusCode == 200) {

          this.setData({
            rollMsg: res.data.msg,
          })

          // console.log(res)

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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // this.setData({
    //   page:1,
    //   pageStatus:true
    // })

    //获取奖品活动列表信息
    wx.request({
      url: reqUrl + 'ad',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();

        if (res.statusCode == 200) {

          //状态排序，已参与在后面,状态相同,按时间升序
          var msg = res.data.msg.sort( function (a , b) {

            if (a.participate === b.participate){
              return a.lottery_time - b.lottery_time;
            }else{
              return a.participate - b.participate;
            } 
          })
        
          // console.log(msg)
        
          this.setData({
            activityMsg: msg
          })

          
          //清除倒计时
          var interval = this.data.interval;
          if (interval != ''){    
            for (let i = interval - msg.length; i <= interval; i++){
              clearInterval(i)
            }            
          }
          
          //添加倒计时
          for (let i in msg) {                     
            let time = Number(msg[i].lottery_time) - Math.round(new Date / 1000);
            let countDown = 'activityMsg[' + i + '].lottery_time';
            msg[i].lottery_time = time;
            this.setData({
              [countDown]: formatTime.formatTime(time)
            })

            this.data.interval = setInterval(() => {
              if (Number(time) > 0) {
                time--;
                this.setData({
                  [countDown]: formatTime.formatTime(time)
                })

              } else {
                clearInterval(interval);
              }
            }, 1000)

          }        


          // console.log(res)

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

    // wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    // if (this.data.pageStatus && this.data.activityMsg.length % 5 == 0){
      
    //   wx.showLoading({
    //     title: '加载中...',
    //     mask: true
    //   })

    //   wx.request({
    //     url: reqUrl + 'ad',
    //     header: {
    //       token: wx.getStorageSync('token')
    //     },
    //     data: {
    //       page: ++this.data.page,
    //       limit: 5
    //     },
    //     method: 'GET',
    //     dataType: 'json',
    //     responseType: 'text',
    //     success: res => {

    //       wx.hideLoading();

    //       if (res.statusCode == 200) {
            
    //         var msg = this.data.activityMsg.concat(res.data.msg);          

    //         this.setData({
    //           activityMsg: msg.sort( (a, b) => {
    //             return a.participate - b.participate
    //           })
    //         })

    //         if (res.data.msg.length < 5) {
    //           this.setData({
    //             pageStatus: false
    //           })
    //         }

    //         // console.log(res)

    //       } else {
    //         wx.showToast({
    //           title: res.data.msg,
    //           icon: 'none',
    //           mask: true,
    //           duration: 500,
    //         })

    //       }
    //     },
    //     fail: function (res) { },
    //     complete: function (res) { },
    //   })
    // } else {
    //   wx.showToast({
    //     title: '没有更多了',
    //     icon: 'none',
    //     mask: true,
    //     duration:500,
    //   })
    // }
    
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
