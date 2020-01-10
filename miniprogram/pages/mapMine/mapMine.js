Page({
  data: {
    id: '',
    longitude: 0,
    latitude: 0,
    polyline: [],
    markers:[],
    speed: 0
  },
  clickEnd() {
    clearInterval(this.data.id)
  },
  clickStart() {
    const id = setInterval(() => {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          console.log(res)
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const polyline = []
          polyline.push({
            latitude,
            longitude
          })
          this.setData({
            latitude,
            longitude,
            polyline,
            speed
          })
        }
      })
    },1000)
    this.setData({
      id
    })
  }
})