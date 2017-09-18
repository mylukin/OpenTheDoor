// pages/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    server: app.API_URI,
    shidu: '???',
    wendu: '???',
    unlock: false,
    action_tip: '',
    openid: '',
    avatar: '',
    nickname: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    try {
      let userData = app.userData
      this.setData({
        openid: userData.openid,
        avatar: userData.userInfo.avatarUrl,
        nickname: userData.userInfo.nickName,
      })
      console.log('userData', userData)
    } catch (error) {

    }

    let url = this.data.server
    wx.request({
      url: url,
      method: 'POST',
      data: {
        userdata: JSON.stringify(app.userData),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: (res) => {
        this.setData(res.data)
        console.log(res.data)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '临沂路81弄28号楼601室',
      path: '/pages/index',
      imageUrl: '/share-cover.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  unlock: function () {
    wx.showNavigationBarLoading()
    this.setData({
      unlock: true,
      action_tip: '正在开门...',
    })
    let url = this.data.server
    wx.request({
      url: url,
      method: 'POST',
      data: {
        openthedoor: 'ON',
        userdata: JSON.stringify(app.userData),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        this.setData(res.data)
        setTimeout(() => {
          this.setData({
            action_tip: ''
          })
        }, 1000)
      },
      fail: (res) => {
        this.setData({
          action_tip: '开门失败'
        })
        setTimeout(() => {
          this.setData({
            action_tip: ''
          })
        }, 1000)
      },
      complete: (res) => {
        wx.hideNavigationBarLoading()
        this.setData({
          unlock: false,
        })
      }
    })
  },
  copy_openid: function (e) {
    let openid = e.target.dataset.openid
    console.log(openid)
    wx.setClipboardData({
      data: openid,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})