// components/fullscreen/fullscreen.js
const { init, close, click } = require('../../sdk/ad_sdk.min.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    adId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    type:"fss",
    fss: true,
    msg: '',
    countDown:'',
    initAd:{}
  },

  //组件实例进入页面，初始化广告组件
  attached() {

    init(this.data.adId, 'fullscreen').then(resolve => {
      
      if(!resolve) {
        console.error('fullscreen 返回数据不正常');
        return;
      }

      if (resolve.type != 1) {
        console.error('fullscreen 广告标识和广告位不匹配');
        return;
      }
     
      this.setData({
        msg: resolve,
        countDown:resolve.second,
        initAd: {
          countDownClass: 'countDown',
          jump: "跳过",
          adTextClass: "adText",
          ad: "广告"
        }
      })

      var countDown = setInterval( () => {

        //倒计时
        var i = this.data.countDown - 1;
        this.setData({
          countDown: i
        })

        //清除倒计时
        if(i <= 0){
          clearInterval(countDown);
          close(this.data.type, this);
        }

      },1000)
      
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //广告点击
    _click(e) {
      click(e.currentTarget.dataset.clickurl)
    },

    //广告关闭
    _close(e) {
      close(e.currentTarget.dataset.type, this)
    }
  }
})
