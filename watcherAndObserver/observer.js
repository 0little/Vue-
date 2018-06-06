/*
监听器用于监听所有的属性
 */
function Observer(data) {
  //把data对象变成监听器的data属性
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function(data) {
    var self = this;
    Object.keys(data).forEach(function(key) {
      //遍历data对象
      self.defineReactive(data, key, data[key]);
    });
  },
  defineReactive: function(data, key, val) {
    //产生一个新的订阅器
    var dep = new Dep();
    //深层遍历
    var childObj = observe(val);
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function getter () {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return val;
      },
      set: function setter (newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        dep.notify();
      }
    });
  }
};

function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return;
  }
  return new Observer(value);
}

function Dep () {
  //盛放订阅者的容器
  this.subs = [];
}
Dep.prototype = {
  //增加订阅者
  addSub: function(sub) {
    this.subs.push(sub);
  },
  //数据发生变化时更新所有的订阅者
  notify: function() {
    this.subs.forEach(function(sub) {
      sub.update();
    });
  }
};
Dep.target = null;