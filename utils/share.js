
module.exports = function share() {
  return {
    title: wx.getStorageSync('nickName') + '正在参与抽奖，拜托你为他助力',
    path: '',
    imageUrl: '../../image/banner.jpg',
  }
}