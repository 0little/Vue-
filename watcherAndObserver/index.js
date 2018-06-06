/*
定义一个名为selfVue的构造函数，传入的参数是一个对象，将对象中的data对象的
所有属性都添加通过方法proxyKeys都变为SelfVue实例的访问器属性，访问器属性
可以自定义自己的get和set方法
*/

function SelfVue(options) {
  this.data = options.data;
  var self = this;

  //遍历data对象
  Object.keys(this.data).forEach(function (key) {
    self.proxyKeys(key);
  });

  //监听这些属性
  observe(this.data);
  new Compile(options.el, this);
}

SelfVue.prototype = {
  proxyKeys: function (key) {
    var self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function getter () {
        return self.data[key];
      },
      set: function setter (newVal) {
        self.data[key] = newVal;
      }
    });
  }
}