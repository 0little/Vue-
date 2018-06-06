function mvvm(options={}) {
    //获取参数
    this.$options =options;
    //绑定data对象
    let data = this.data = this.$options.data;
    //监听数据变化
    observer(data);
    //将data对象中的属性都设置为该对象的访问器属性
    for(let key in data){
        Object.defineProperty(this,key,{
            enumerable:true,
            get(){
                return this.data[key];
            },
            set(newVal){
                this.data[key] = newVal;
            }
        })
    }
    //编译模板
    Compile(options.el,this);
}

//编译模板
function Compile(el,vm) {
    vm.$el = document.querySelector(el);
    //创建一个新的空白文档片段
    let fragment = document.createDocumentFragment();
    while (child = vm.$el.firstChild){
         fragment.appendChild(child);
    }

    //存在的bug，一句里面只允许有一个变量
    function replace(fragment) {
        Array.from(fragment.childNodes).forEach((node)=>{
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/;//模板字符串
            //对文本结点的处理
            if(node.nodeType === 3 && reg.test(text)){
                //RegExp.$1第一个匹配到的分组
                let arr = RegExp.$1.split(".");
                let val = vm;
                //取得属性值，这个方法很棒棒
                arr.forEach(item=>val = val[item]);
                //增加一个监听者
                new Watcher(vm,RegExp.$1,(newVal)=>{
                    node.textContent = text.replace(/\{\{(.*)\}\}/,newVal);
                })
                //对模板字符串进行替换
                node.textContent = text.replace(/\{\{(.*)\}\}/,val);
            }
            if(node.nodeType === 1){
              //获取结点属性值
                let nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach(attr=>{
                    console.log(attr.name);
                    let exp = attr.value;
                    if(attr.name.indexOf("v-")==0){
                        node.value = vm[exp];
                    };
                    //对属性进行监听
                    new Watcher(vm,exp,function (newVal) {
                        node.value = newVal;
                    })
                    //监听input事件
                    node.addEventListener("input",e=>{
                        let newVal = e.target.value;
                        vm[exp]= newVal;
                    })
                })
            }
            //递归调用
            if(node.childNodes){
                replace(node)
            }
        })
    }
    replace(fragment);
    vm.$el.appendChild(fragment);
}
function observer(data) {
    if(typeof data =="object")
    Obsreve(data);
}
function Obsreve(data) {
    let deep = new Dep();
    for(let key in data){
        let val = data[key];
        //递归调用
        observer(val);
        Object.defineProperty(data,key,{
        enumerable:true,
        get(){
            //把使用到这个值的对象存起来
            Dep.target&&deep.addSub(Dep.target);
            return val;
        },
        set(newVal) {
            if(newVal === val)return;
            val = newVal;
            observer(newVal);
            deep.notify(); //更新所有
            }
        })
    }
}


function Dep() {
    this.subs =[];
}
Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
}
Dep.prototype.notify = function () {
    this.subs.forEach(sub=>sub.update());
}
function Watcher(vm,exp,fn) {
    this.vm = vm;
    this.exp = exp;
    this.fn = fn;
    Dep.target = this;
    let val = vm;
    let arr = exp.split(".");
    arr.forEach((key)=>{
        val = val[key];
    })
    Dep.target = null;
}

Watcher.prototype.update = function(){
    let val = this.vm;
    let arr = this.exp.split(".");
    arr.forEach((key)=>{
        val = val[key];
    })
    this.fn(val);
}