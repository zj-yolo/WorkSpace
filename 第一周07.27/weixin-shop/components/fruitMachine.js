
class FruitMachine {

  constructor(pageContext, opts) {
    this.page = pageContext
    this.len = opts.len || 8
    this.ret = opts.ret
    this.speed = opts.speed
    this.countmy = opts.countmy
    this.isStart = false
    this.endCallBack = opts.callback
    this.page.start = this.start.bind(this)
  }

  start() {
    let { idx, ret, len, speed, isStart } = this
    if (isStart) return
    this.isStart = true
    let range = Math.floor(Math.random() * 3 + 2)   //圈数
    let count = 0   //id数
    let spd2 = Math.floor(speed / range / len * 0.8)  //速度
    !(function interval(self) {
      setTimeout(() => {
        count++
        if (count > range * len) {
          speed += 4 * spd2
        } else {
          speed -= spd2
        }
        if (count != (range * 2) * len + ret) {
          interval(self)
        } else {
          self.isStart = false
          self.endCallBack && self.endCallBack()
        }

        self.page.setData({
          machine: {
            idx: count % 8 == 0 ? 8 : count % 8
          }
        })

      }, speed)
    })(this)
  }
   

  reset() {
    this.page.setData({
      machine: {
        idx: ''
      }
    })
  }


}

export default FruitMachine