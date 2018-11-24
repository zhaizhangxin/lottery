// components/ad-component.js
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
    bs: true,
    msg:'',
    initAd:{}
  },

  //组件实例进入页面，初始化广告组件
  attached() {
    
    init(this.data.adId, 'banner').then(resolve => {

      if (!resolve) {
        console.error('banner 返回数据不正常');
        return;
      }

      if (resolve.type != 2) {
        console.error('banner 广告标识和广告位不匹配');
        this.setData({
          bs:false
        })
        return;
      }

      this.setData({
        msg: resolve,
        initAd: {
          closeSrc: '../images/close-b.png',
          adTextClass: "adText",
          ad: "广告"
        }
      })
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
