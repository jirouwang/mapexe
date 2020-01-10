const points = []
let runtime = 0
Page({
  data: {
    id: '',
    longitude: 0,
    latitude: 0,
    polyline: [{
      points: [],
      color: 'red',
      borderColor: 'green',
      width: 5
    }],
    speed: 0,
    runtime: 0,
    distance: 0
  },
  distance(la1, lo1, la2, lo2) {
    if(la1===0||lo1===0) {
      return 0
    }
    if(la1===la2&&lo1==lo2) {
      return 0
    }
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10000;
    return s * 1000
  },
  clickEnd() {
    clearInterval(this.data.id)
  },
  clickStart() {
    const id = setInterval(() => {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed  
          points.push({
            latitude,
            longitude
          })
          console.log(latitude, longitude)
          let distance = this.distance(this.data.latitude, this.data.longitude, latitude, longitude)
          console.log(distance)
          this.setData({
            latitude,
            longitude,
            polyline: [{
              points,
              color: 'red',
              borderColor: 'green',
              width: 5
            }],
            speed,
            distance: (Number(this.data.distance) + Number(distance)).toFixed(2)
          })
        }
      })
      this.setData({
        runtime: this.data.runtime + 1
      })
    },1000)
    this.setData({
      id
    })
  }
})