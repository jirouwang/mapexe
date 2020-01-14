
let app = getApp();
// 获取数据库引用
const db = wx.cloud.database();
const userListDB = db.collection('user');

let name = null;
let studentID = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  //输入学号
  inputStudentID(evnet) {
    studentID = evnet.detail.value;
  },
  //输入姓名
  inputName(evnet) {
    name = evnet.detail.value;
  },
  //注册
  getInitLocation() {
    wx.getLocation({
      type: 'gcj02',
      complete: (res) => {
        console.log(res)
        if(res.latitude) {
          app.globalData.initLongitude = res.longitude
          app.globalData.initLatitude = res.latitude
        }
        
        wx.navigateTo({
          //目的页面地址
          url: '../mapMine/mapMine',
          success: function (res) {
            console.log('登陆成功')
            console.log(app.globalData.initLatitude,app.globalData.initLongitude)
          }
        })
      }
    })
  },
  login() {
    app.globalData.studentID = studentID
    app.globalData.name = name
    // 查询用户是否已经登陆过
    userListDB.where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success: (res) => {
        let userInfos = res.data;
        console.log(1)
        if (userInfos && userInfos.length > 0) {
          console.log(2)
          console.log(userInfos)
          console.log(userInfos[0].name==name)
          if (userInfos[0].name == name && userInfos[0].studentID == studentID) {
            console.log('已经登录,跳转到跑步页面')
            this.getInitLocation()
            
          }else {
            if (studentID == null || name == null) {
              console.log('请输入完全')
              wx.showModal({
                title: '温馨提示',
                content: '学号或姓名不能为空',
                showCancel: false
              })
              return
            }
            console.log('请使用本人微信填写正确的学号和姓名')
            wx.showModal({
              title: '温馨提示',
              content: '请使用本人的微信并填写对应正确的学号和姓名',
              showCancel: false
            })
          }
        } else {
          this.saveuserinfo();
        }
      }
    })
  },
  saveuserinfo() {
    let that = this;
    if (studentID==null||name==null) {
      console.log('请输入完全')
      wx.showModal({
        title: '温馨提示',
        content: '学号或姓名不能为空',
        showCancel: false
      })
      return 
    }
    userListDB.add({
      data: {
        // openid: app.globalData.openid,
        studentID: studentID,
        name: name   
      }
    }).then(res => {
      console.log('首次登陆,跳转到跑步页面')
      this.getInitLocation()
    })
  },
})