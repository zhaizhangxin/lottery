const reqUrl = require('../../utils/reqUrl');
const formatTime = require('../../utils/util.js')

//index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //滚动消息
    rollMsg: '',
    //活动信息
    lottery: [],
    rank: [],
    collect: [],
    // page:1,
    // pageStatus:true,

    //倒计时
    interval: '',
    signInSuccess: false,
    aleadySign: false,
  },

  /**
   * 事件处理函数
   */

  detaliJump: function(e) {
    // console.log(e);
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id
      // url: '../lottery/lottery?id=' + id
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 签到
  signIn: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this;
    wx.request({
      url: reqUrl + 'award_sign',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        wx.hideLoading();

        console.log(res);
        if (res.data.error_code == 0) {
          that.setData({
            signInSuccess: true
          })
        } else if (res.data.error_code == 40041) {
          that.setData({
            aleadySign: true
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            mask: true
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 点击关闭
  successExit: function() {
    this.setData({
      signInSuccess: false,
      aleadySign: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //获取奖品活动列表信息
    wx.request({
      // url: reqUrl + 'ad',
      url: reqUrl + 'award_ad',
      header: {
        token: wx.getStorageSync('token')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {

        wx.hideLoading();
        console.log(res);
        if (res.statusCode == 200) {
          // 滚动信息
          var rollMsg = res.data.msg.roll;
          this.setData({
            rollMsg: rollMsg
          })
          // 抽奖次数
          this.setData({
            lottery_num: res.data.msg.lottery_num,
            wining_num: res.data.msg.wining_num
          })
          // 已中奖人数

          // 天天免费抽奖
          var lottery = res.data.msg.lottery;
          //状态排序，已参与在后面,状态相同,按时间升序
          var lottery = res.data.msg.lottery.sort(function(a, b) {
            if (a.participate === b.participate) {
              return a.lottery_time - b.lottery_time;
            } else {
              return a.participate - b.participate;
            }
          })
          this.setData({
            lottery: lottery
          })



          //清除倒计时
          var interval = this.data.interval;
          if (interval != '') {
            for (let i = interval - lottery.length; i <= interval; i++) {
              clearInterval(i)
            }
          }

          //添加倒计时
          for (let i in lottery) {
            let time = Number(lottery[i].lottery_time) - Math.round(new Date / 1000);
            let countDown = 'lottery[' + i + '].lottery_time';
            lottery[i].lottery_time = time;
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

          // 邀请好友
          var rank = res.data.msg.rank;
          if (rank != undefined && rank != '') {
            //状态排序，已参与在后面,状态相同,按时间升序
            var rank = res.data.msg.rank.sort(function(a, b) {
              if (a.participate === b.participate) {
                return a.lottery_time - b.lottery_time;
              } else {
                return a.participate - b.participate;
              }
            })
            this.setData({
              rank: rank
            })
            //清除倒计时
            var interval = this.data.interval;
            if (interval != '') {
              for (let i = interval - rank.length; i <= interval; i++) {
                clearInterval(i)
              }
            }
            //添加倒计时
            for (let i in rank) {
              let time = Number(rank[i].lottery_time) - Math.round(new Date / 1000);
              let countDown = 'rank[' + i + '].lottery_time';
              rank[i].lottery_time = time;
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
          } else {
            let rank = '';
            this.setData({
              rank: rank
            })
          }

          // 排名
          var collect = res.data.msg.collect;
          if (collect != undefined && collect != '') {
            //状态排序，已参与在后面,状态相同,按时间升序
            var collect = res.data.msg.collect.sort(function(a, b) {
              if (a.participate === b.participate) {
                return a.lottery_time - b.lottery_time;
              } else {
                return a.participate - b.participate;
              }
            })
            this.setData({
              collect: collect
            })
            //清除倒计时
            var interval = this.data.interval;
            if (interval != '') {
              for (let i = interval - collect.length; i <= interval; i++) {
                clearInterval(i)
              }
            }
            //添加倒计时
            for (let i in collect) {
              let time = Number(collect[i].lottery_time) - Math.round(new Date / 1000);
              let countDown = 'collect[' + i + '].lottery_time';
              collect[i].lottery_time = time;
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
          } else {
            let collect = '';
            this.setData({
              collect: collect
            })
          }

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true
          })

        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

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

    // wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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
  onShareAppMessage: function() {
    var uid = wx.getStorageSync('uid');
    return {
      title: '先到先得！口袋喊你大奖一起免费拿',
      path: '/pages/login/login?uid=' + uid,
    }
  }

})