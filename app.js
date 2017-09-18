//app.js
App({
  API_URI: 'https://home.lukin.cn/opendoor.php',
  onLaunch: function (options) {
    console.log(options)
    try {
      wx.setTopBarText({
        text: '临沂路81弄28号601室'
      })
    } catch (err) {

    }

    try {
      var userData = wx.getStorageSync('userData')
      if (userData) {
        this.userData = userData
        console.log('userData ok', this.userData)
      } else {
        this.login()
      }
    } catch (e) {

    }

  },
  userData: {},
  login: function () {
    wx.login({
      success: (wxlogin_res) => {
        if (wxlogin_res.code) {
          //发起网络请求
          wx.request({
            url: this.API_URI,
            method: 'POST',
            data: {
              action: 'login',
              code: wxlogin_res.code,
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: (login_res) => {
              console.log('login_res', login_res.data)
              // 获取用户信息
              wx.getUserInfo({
                withCredentials: false,
                lang: 'zh_CN',
                success: (user_res) => {
                  user_res.openid = login_res.data.openid
                  console.log('wx.getUserInfo', user_res)
                  this.userData = user_res
                  // 缓存数据
                  try {
                    wx.setStorageSync('userData', this.userData)
                  } catch (e) {

                  }
                },
                fail: () => {
                  this.userData = {
                    openid: login_res.data.openid
                  }
                  // 缓存数据
                  try {
                    wx.setStorageSync('userData', this.userData)
                  } catch (e) {

                  }
                  console.log('wx.getUserInfo.fail', this.userData)
                },
                complete: () => {
                  // 重启应用
                  wx.reLaunch({
                    url: '/pages/index',
                  })
                }
              })
            }
          })
        }
      }
    })
  }
})