/*JS开发常用工具函数*/

/**
 1、isStatic：检测数据是不是除了symbol外的原始数据
 */
function isStatic(value) {
	return(
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		typeof value === 'undefined' ||
		value === null
	)
}

/**
 2、isPrimitive：检测数据是不是原始数据
 */
function isPrimitive(value) {
	return isStatic(value) || typeof value === 'symbol'
}

/**
 3、isObject：判断数据是不是引用类型的数据 (例如： arrays, functions, objects, regexes, new Number(0),以及 new String(''))
 */
function isObject(value) {
  	let type = typeof value;
  	return value != null && (type == 'object' || type == 'function');
}

/**
 4、isObjectLike：检查 value 是否是 类对象。 如果一个值是类对象，那么它不应该是 null，而且 typeof 后的结果是 "object"
 */
function isObjectLike(value) {
  	return value != null && typeof value == 'object';
}
	
/*
 5、getRawType：获取数据类型，返回结果为 Number、String、Object、Array等
 */
function getRawType(value) {
	return Object.prototype.toString.call(value).slice(8, -1)
}
//getoRawType([]) ==> Array

/**
 6、isPlainObject：判断数据是不是Object类型的数据
 */
function isPlainObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 7、isArray：判断数据是不是数组类型的数据
 */
function isArray(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]'
}
/*
 将isArray挂载到Array上
 * */
Array.isArray = Array.isArray || isArray;

/**
 8、isRegExp：判断数据是不是正则对象
 */
function isRegExp(value) {
	return Object.prototype.toString.call(value) === '[object RegExp]'
}

/**
 9、isDate：判断数据是不是时间对象
 */
function isDate(value) {
	return Object.prototype.toString.call(value) === '[object Date]'
}

/*
 10、isNative：判断 value 是不是浏览器内置函数
 内置函数toString后的主体代码块为 [native code] ，而非内置函数则为相关代码，所以非内置函数可以进行拷贝(toString后掐头去尾再由Function转)
 * */
function isNative(value) {
	return typeof value === 'function' && /native code/.test(value.toString())
}

/*
 11、isFunction：检查 value 是不是函数
 * */
function isFunction(value) {
	return Object.prototype.toString.call(value) === '[object Function]'
}

/*
 12、isLength：检查 value 是否为有效的类数组长度。
 * */
function isLength(value) {
  	return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= Number.MAX_SAFE_INTEGER;
}

/*
 13、isArrayLike：检查 value 是否是类数组。 
 如果一个值被认为是类数组，那么它不是一个函数，并且value.length是个整数，大于等于 0，小于或等于 Number.MAX_SAFE_INTEGER。
 这里字符串也将被当作类数组
 * */
function isArrayLike(value) {
  	return value != null && isLength(value.length) && !isFunction(value);
}

/*
 14、isEmpty：检查 value 是否为空
 如果是null，直接返回true；如果是类数组，判断数据长度；如果是Object对象，判断是否具有属性；如果是其他数据，直接返回false(也可改为返回true)
 * */
function isEmpty(value) {
    if (value == null) {
        return true;
    }
    if (isArrayLike(value)) {
        return !value.length;
    }else if(isPlainObject(value)){
      	for (let key in value) {
	        if (hasOwnProperty.call(value, key)) {
	          return false;
	        }
	    }
      	return true;
    }
    return false;
}

/**
 15、cached：记忆函数：缓存函数的运算结果。
 */
function cached(fn) {
	let cache = Object.create(null);
	return function cachedFn(str) {
		let hit = cache[str];
		return hit || (cache[str] = fn(str))
	}
}

/*
 16、camelize：横线转驼峰命名
 * */
let camelizeRE = /-(\w)/g;
function camelize(str) {
	return str.replace(camelizeRE, function(_, c) {
		return c ? c.toUpperCase() : '';
	})
}
//ab-cd-ef ==> abCdEf
//使用记忆函数
let _camelize = cached(camelize)
	
/**
 17、hyphenate：驼峰命名转横线命名：拆分字符串，使用 - 相连，并且转换为小写
 */
let hyphenateRE = /\B([A-Z])/g;
function hyphenate(str){
	return str.replace(hyphenateRE, '-$1').toLowerCase()
}
//abCd ==> ab-cd
//使用记忆函数
let _hyphenate = cached(hyphenate);
	
/**
 18、capitalize：字符串首位大写
 */
function capitalize(str){
	return str.charAt(0).toUpperCase() + str.slice(1)
}
// abc ==> Abc
//使用记忆函数
let _capitalize = cached(capitalize)

/**
 19、extend：将属性混合到目标对象中
 */
function extend(to, _from) {
	for(let key in _from) {
		to[key] = _from[key];
	}
	return to
}

/*
 20、Object.assign：对象属性复制，浅拷贝
 * */
Object.assign = Object.assign || function(){
	if(arguments.length == 0) throw new TypeError('Cannot convert undefined or null to object');
	
	let target = arguments[0],
		args = Array.prototype.slice.call(arguments, 1),
		key
	args.forEach(function(item){
		for(key in item){
			item.hasOwnProperty(key) && ( target[key] = item[key] )
		}
	})
	return target
}
/*
 使用Object.assign可以浅克隆一个对象：let clone = Object.assign({}, target)
 简单的深克隆可以使用JSON.parse()和JSON.stringify()，这两个api是解析json数据的，所以只能解析除symbol外的原始类型及数组和对象
 let clone = JSON.parse( JSON.stringify(target) )
 * */

/*
 21、clone：克隆数据，可深度克隆
 这里列出了原始类型，时间、正则、错误、数组、对象的克隆规则，其他的可自行补充
 * */
function clone(value, deep){
	if(isPrimitive(value)){
		return value
	}
	
	if (isArrayLike(value)) { //是类数组
		value = Array.prototype.slice.call(value)
		return value.map(item => deep ? clone(item, deep) : item)
   	}else if(isPlainObject(value)){ //是对象
   		let target = {}, key;
      	for (key in value) {
	        value.hasOwnProperty(key) && ( target[key] = deep ? clone(value[key], deep) : value[key] )
	    }
    }
    
    let type = getRawType(value)
    
    switch(type){
    	case 'Date':
    	case 'RegExp': 
    	case 'Error': value = new window[type](value); break;
    }
    return value
}

/*
 22、识别各种浏览器及平台
 * */
//运行环境是浏览器
let inBrowser = typeof window !== 'undefined';
//运行环境是微信
let inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
let weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
//浏览器 UA 判断
let UA = inBrowser && window.navigator.userAgent.toLowerCase();
let isIE = UA && /msie|trident/.test(UA);
let isIE9 = UA && UA.indexOf('msie 9.0') > 0;
let isEdge = UA && UA.indexOf('edge/') > 0;
let isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
let isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
let isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

/*
 23、getExplorerInfo：获取浏览器信息
 * */
function getExplorerInfo() {
	let t = navigator.userAgent.toLowerCase();
	return 0 <= t.indexOf("msie") ? { //ie < 11
		type: "IE",
		version: Number(t.match(/msie ([\d]+)/)[1])
	} : !!t.match(/trident\/.+?rv:(([\d.]+))/) ? { // ie 11
		type: "IE",
		version: 11
	} : 0 <= t.indexOf("edge") ? {
		type: "Edge",
		version: Number(t.match(/edge\/([\d]+)/)[1])
	} : 0 <= t.indexOf("firefox") ? {
		type: "Firefox",
		version: Number(t.match(/firefox\/([\d]+)/)[1])
	} : 0 <= t.indexOf("chrome") ? {
		type: "Chrome",
		version: Number(t.match(/chrome\/([\d]+)/)[1])
	} : 0 <= t.indexOf("opera") ? {
		type: "Opera",
		version: Number(t.match(/opera.([\d]+)/)[1])
	} : 0 <= t.indexOf("Safari") ? {
		type: "Safari",
		version: Number(t.match(/version\/([\d]+)/)[1])
	} : {
		type: t,
		version: -1
	}
}

/*
 24、isPCBroswer：检测是否为PC端浏览器模式
 * */
function isPCBroswer() {
	let e = navigator.userAgent.toLowerCase()
		, t = "ipad" == e.match(/ipad/i)
		, i = "iphone" == e.match(/iphone/i)
		, r = "midp" == e.match(/midp/i)
		, n = "rv:1.2.3.4" == e.match(/rv:1.2.3.4/i)
		, a = "ucweb" == e.match(/ucweb/i)
		, o = "android" == e.match(/android/i)
		, s = "windows ce" == e.match(/windows ce/i)
		, l = "windows mobile" == e.match(/windows mobile/i);
	return !(t || i || r || n || a || o || s || l)
}

/*
 25、unique：数组去重，返回一个新数组
 * */
function unique(arr){
	if(!isArrayLink(arr)){ //不是类数组对象
		return arr
	}
	let result = []
	let objarr = []
	let obj = Object.create(null)
	
	arr.forEach(item => {
		if(isStatic(item)){//是除了symbol外的原始数据
			let key = item + '_' + getRawType(item);
			if(!obj[key]){
				obj[key] = true
				result.push(item)
			}
		}else{//引用类型及symbol
			if(!objarr.includes(item)){
				objarr.push(item)
				result.push(item)
			}
		}
	})
	
	return resulte
}

/*
 26、Set简单实现
 * */
window.Set = window.Set || (function () {
	function Set(arr) {
		this.items = arr ? unique(arr) : [];
    	this.size = this.items.length; // Array的大小
	}
	Set.prototype = {
		add: function (value) {
			// 添加元素,若元素已存在,则跳过，返回 Set 结构本身。
			if (!this.has(value)) {
	            this.items.push(value);
	            this.size++;
	        }
	        return this;
		},
		clear: function () {
			//清除所有成员，没有返回值。
			this.items = []
			this.size = 0
		},
		delete: function (value) {
			//删除某个值，返回一个布尔值，表示删除是否成功。
			return this.items.some((v, i) => {
				if(v === value){
					this.items.splice(i,1)
					return true
				}
				return false
			})
		},
		has: function (value) {
			//返回一个布尔值，表示该值是否为Set的成员。
			return this.items.some(v => v === value)
		},
		values: function () {
			return this.items
		},
	}

	return Set;
}());

/*
 27、repeat：生成一个重复的字符串，有n个str组成，可修改为填充为数组等
 * */
function repeat(str, n) {
	let res = '';
	while(n) {
		if(n % 2 === 1) {
			res += str;
		}
		if(n > 1) {
			str += str;
		}
		n >>= 1;
	}
	return res
};
//repeat('123',3) ==> 123123123

/*
 28、dateFormater：格式化时间
 * */
function dateFormater(formater, t){
	let date = t ? new Date(t) : new Date(),
		Y = date.getFullYear() + '',
		M = date.getMonth() + 1,
		D = date.getDate(),
		H = date.getHours(),
		m = date.getMinutes(),
		s = date.getSeconds();
	return formater.replace(/YYYY|yyyy/g,Y)
		.replace(/YY|yy/g,Y.substr(2,2))
		.replace(/MM/g,(M<10?'0':'') + M)
		.replace(/DD/g,(D<10?'0':'') + D)
		.replace(/HH|hh/g,(H<10?'0':'') + H)
		.replace(/mm/g,(m<10?'0':'') + m)
		.replace(/ss/g,(s<10?'0':'') + s)
}
// dateFormater('YYYY-MM-DD HH:mm', t) ==> 2019-06-26 18:30
// dateFormater('YYYYMMDDHHmm', t) ==> 201906261830

/*
 29、dateStrForma：将指定字符串由一种时间格式转化为另一种
 from的格式应对应str的位置
 * */
function dateStrForma(str, from, to){
	//'20190626' 'YYYYMMDD' 'YYYY年MM月DD日'
	str += ''
	let Y = ''
	if(~(Y = from.indexOf('YYYY'))){
		Y = str.substr(Y, 4)
		to = to.replace(/YYYY|yyyy/g,Y)
	}else if(~(Y = from.indexOf('YY'))){
		Y = str.substr(Y, 2)
		to = to.replace(/YY|yy/g,Y)
	}

	let k,i
	['M','D','H','h','m','s'].forEach(s =>{
		i = from.indexOf(s+s)
		k = ~i ? str.substr(i, 2) : ''
		to = to.replace(s+s, k)
	})
	return to
}
// dateStrForma('20190626', 'YYYYMMDD', 'YYYY年MM月DD日') ==> 2019年06月26日
// dateStrForma('121220190626', '----YYYYMMDD', 'YYYY年MM月DD日') ==> 2019年06月26日
// dateStrForma('2019年06月26日', 'YYYY年MM月DD日', 'YYYYMMDD') ==> 20190626

// 一般的也可以使用正则来实现
//'2019年06月26日'.replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1-$2-$3') ==> 2019-06-26

/*
 30、getPropByPath：根据字符串路径获取对象属性 : 'dcjgs[0].count'
 * */
function getPropByPath(obj, path, strict) {
  	let tempObj = obj;
  	path = path.replace(/\[(\w+)\]/g, '.$1'); //将[0]转化为.0
  	path = path.replace(/^\./, ''); //去除开头的.

  	let keyArr = path.split('.'); //根据.切割
  	let i = 0;
  	for (let len = keyArr.length; i < len - 1; ++i) {
		if (!tempObj && !strict) break;
		let key = keyArr[i];
		if (key in tempObj) {
			tempObj = tempObj[key];
		} else {
			if (strict) {//开启严格模式，没找到对应key值，抛出错误
				throw new Error('please transfer a valid prop path to form item!');
			}
			break;
		}
  	}
  	return {
		o: tempObj, //原始数据
		k: keyArr[i], //key值
		v: tempObj ? tempObj[keyArr[i]] : null // key值对应的值
  	};
};
	
/*
 31、GetUrlParam：获取Url参数，返回一个对象
 * */
function GetUrlParam(){
	let url = document.location.toString();
	let arrObj = url.split("?");
	let params = Object.create(null)
	if (arrObj.length > 1){
		arrObj = arrObj[1].split("&");
		arrObj.forEach(item=>{
			item = item.split("=");
			params[item[0]] = item[1]
		})
	}
	return params;
}
// ?a=1&b=2&c=3 ==> {a: "1", b: "2", c: "3"}
	

/*
 32、downloadFile：base64数据导出文件，文件下载
 * */
function downloadFile(filename, data){
	let DownloadLink = document.createElement('a');

	if ( DownloadLink ){
		document.body.appendChild(DownloadLink);
		DownloadLink.style = 'display: none';
		DownloadLink.download = filename;
		DownloadLink.href = data;

		if ( document.createEvent ){
			let DownloadEvt = document.createEvent('MouseEvents');

			DownloadEvt.initEvent('click', true, false);
			DownloadLink.dispatchEvent(DownloadEvt);
		}
		else if ( document.createEventObject )
			DownloadLink.fireEvent('onclick');
		else if (typeof DownloadLink.onclick == 'function' )
			DownloadLink.onclick();

		document.body.removeChild(DownloadLink);
	}
}

//33、toFullScreen：全屏
function toFullScreen(){
	let elem = document.body;
	elem.webkitRequestFullScreen 
	? elem.webkitRequestFullScreen()
	: elem.mozRequestFullScreen
	? elem.mozRequestFullScreen()
	: elem.msRequestFullscreen
	? elem.msRequestFullscreen()
	: elem.requestFullScreen
	? elem.requestFullScreen()
	: alert("浏览器不支持全屏");
}

//34、exitFullscreen：退出全屏
function exitFullscreen(){
	let elem = parent.document;
	elem.webkitCancelFullScreen 
	? elem.webkitCancelFullScreen()
	: elem.mozCancelFullScreen
	? elem.mozCancelFullScreen()
	: elem.cancelFullScreen
	? elem.cancelFullScreen()
	: elem.msExitFullscreen
	? elem.msExitFullscreen()
	: elem.exitFullscreen
	? elem.exitFullscreen()
	: alert("切换失败,可尝试Esc退出");
}

//35、requestAnimationFrame：window动画
window.requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	function (callback) {
	    //为了使setTimteout的尽可能的接近每秒60帧的效果
	    window.setTimeout(callback, 1000 / 60);
	};
	
window.cancelAnimationFrame = window.cancelAnimationFrame ||
	Window.webkitCancelAnimationFrame ||
	window.mozCancelAnimationFrame ||
	window.msCancelAnimationFrame ||
	window.oCancelAnimationFrame ||
	function (id) {
	    //为了使setTimteout的尽可能的接近每秒60帧的效果
	    window.clearTimeout(id);
	}
	
/*
 36、_isNaN：检查数据是否是非数字值
 原生的isNaN会把参数转换成数字(valueof)，而null、true、false以及长度小于等于1的数组(元素为非NaN数据)会被转换成数字，这不是我想要的
 Symbol类型的数据不具有valueof接口，所以isNaN会抛出错误，这里放在后面，可避免错误
 * */
function _isNaN(v){
	return !(typeof v === 'string' || typeof v === 'number') || isNaN(v)
}

/*
 37、max：求取数组中非NaN数据中的最大值
 * */
function max(arr){
	arr = arr.filter(item => !_isNaN(item))
	return arr.length ? Math.max.apply(null, arr) : undefined
}
//max([1, 2, '11', null, 'fdf', []]) ==> 11

/*
 38、min：求取数组中非NaN数据中的最小值
 * */
function min(arr){
	arr = arr.filter(item => !_isNaN(item))
	return arr.length ? Math.min.apply(null, arr) : undefined
}
//min([1, 2, '11', null, 'fdf', []]) ==> 1

/*
 39、random：返回一个lower - upper之间的随机数
 lower、upper无论正负与大小，但必须是非NaN的数据
 * */
function random(lower, upper){
	lower = +lower || 0
	upper = +upper || 0
	return Math.random() * (upper - lower) + lower;
}
//random(0, 0.5) ==> 0.3567039135734613
//random(2, 1) ===> 1.6718418553475423
//random(-2, -1) ==> -1.4474325452361945

/*
 40、Object.keys：返回一个由一个给定对象的自身可枚举属性组成的数组
 * */
Object.keys = Object.keys || function keys(object) {
	if(object === null || object === undefined){
		throw new TypeError('Cannot convert undefined or null to object');
	}
	let result = []
	if(isArrayLike(object) || isPlainObject(object)){
		for (let key in object) {
	        object.hasOwnProperty(key) && ( result.push(key) )
	    }
	}
	return result
}

/*
 41、Object.values：返回一个给定对象自身的所有可枚举属性值的数组
 * */
Object.values = Object.values || function values(object) {
	if(object === null || object === undefined){
		throw new TypeError('Cannot convert undefined or null to object');
	}
	let result = []
	if(isArrayLike(object) || isPlainObject(object)){
		for (let key in object) {
	        object.hasOwnProperty(key) && ( result.push(object[key]) )
	    }
	}
	return result
}

/*
 42、arr.fill：使用 value 值来填充 array，从start位置开始, 到end位置结束（但不包含end位置），返回原数组
 * */
Array.prototype.fill = Array.prototype.fill || function fill(value, start, end) {
	let ctx = this
	let length = ctx.length;
	
	start = parseInt(start)
	if(isNaN(start)){
		start = 0
	}else if (start < 0) {
    	start = -start > length ? 0 : (length + start);
  	}
  	
  	end = parseInt(end)
  	if(isNaN(end) || end > length){
  		end = length
  	}else if (end < 0) {
        end += length;
    }
    
    while (start < end) {
        ctx[start++] = value;
    }
    return ctx;
}
//Array(3).fill(2) ===> [2, 2, 2]

/*
 43、arr.includes：用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false，可指定开始查询的位置
 * */
Array.prototype.includes = Array.prototype.includes || function includes(value, start){
	let ctx = this
	let length = ctx.length;
	
	start = parseInt(start)
	if(isNaN(start)){
		start = 0
	}else if (start < 0) {
    	start = -start > length ? 0 : (length + start);
  	}
	
	let index = ctx.indexOf(value)
	
	return index >= start;
}

/*
 44、arr.find：返回数组中通过测试（函数fn内判断）的第一个元素的值
 * */
Array.prototype.find = Array.prototype.find || function find(fn, ctx){
	fn = fn.bind(ctx)
	
	let result;
	this.some((value, index, arr) => {
		return fn(value, index, arr) ? (result = value, true) : false
	})
	
	return result
}

/*
 45、arr.findIndex：返回数组中通过测试（函数fn内判断）的第一个元素的下标
 * */
Array.prototype.findIndex = Array.prototype.findIndex || function findIndex(fn, ctx){
	fn = fn.bind(ctx)
	
	let result;
	this.some((value, index, arr) => {
		return fn(value, index, arr) ? (result = index, true) : false
	})
	
	return result
}

/*
 46、performance.timing：利用performance.timing进行性能分析
 * */
window.onload = function(){
	setTimeout(function(){
		let t = performance.timing
		console.log('DNS查询耗时 ：' + (t.domainLookupEnd - t.domainLookupStart).toFixed(0))
		console.log('TCP链接耗时 ：' + (t.connectEnd - t.connectStart).toFixed(0))
		console.log('request请求耗时 ：' + (t.responseEnd - t.responseStart).toFixed(0))
		console.log('解析dom树耗时 ：' + (t.domComplete - t.domInteractive).toFixed(0))
		console.log('白屏时间 ：' + (t.responseStart - t.navigationStart).toFixed(0))
		console.log('domready时间 ：' + (t.domContentLoadedEventEnd - t.navigationStart).toFixed(0))
		console.log('onload时间 ：' + (t.loadEventEnd - t.navigationStart).toFixed(0))

		if(t = performance.memory){
			console.log('js内存使用占比 ：' + (t.usedJSHeapSize / t.totalJSHeapSize * 100).toFixed(2) + '%')
		}
	})
}

//47、禁止某些键盘事件
document.addEventListener('keydown', function(event){
	return !(
		112 == event.keyCode || //F1
		123 == event.keyCode || //F12
		event.ctrlKey && 82 == event.keyCode || //ctrl + R
		event.ctrlKey && 78 == event.keyCode || //ctrl + N
		event.shiftKey && 121 == event.keyCode || //shift + F10
		event.altKey && 115 == event.keyCode || //alt + F4
		"A" == event.srcElement.tagName && event.shiftKey //shift + 点击a标签
	) || (event.returnValue = false)
});
//48、禁止右键、选择、复制
['contextmenu', 'selectstart', 'copy'].forEach(function(ev){
	document.addEventListener(ev, function(event){
		return event.returnValue = false
	})
});
