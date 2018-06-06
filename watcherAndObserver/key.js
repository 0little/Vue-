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

//订阅者
function Watcher(vm, cb) {
  this.cb = cb; //数据发生变化时要执行的回调函数
  this.vm = vm; //SelfVue实例
  this.value = this.get();  // 将自己添加到订阅器的操作
}

Watcher.prototype = {
  update: function() {
    this.run();
  },
  run: function() {
    var value = this.vm.data[this.exp];
    var oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);//回调函数用于更新视图
    }
  },
  get: function() {
    Dep.target = this;  // 缓存自己
    var value = this.vm.data[this.exp];  // 强制执行监听器里的get函数
    Dep.target = null;  // 释放自己
    return value;
  }
};

function SelfVue(options) {
  this.data = options.data;
  var self = this;

  //遍历data对象
  Object.keys(this.data).forEach(function (key) {
    self.proxyKeys(key);
  });

  //监听这些属性
  observe(this.data);
  new Watcher(this, function () {
    document.getEle
  })
}