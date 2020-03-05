var fs = require('fs')        //属于node.js模块 -- fs模块：fs模块用于系统文件及目录进行读写操作
var path = require('path')    //属于node.js模块 -- Path模块：处理路径的核心模块，方便处理文件路径问题

var inputDir = "E:\\projects\\svn_art\\fairygui_Q\\ermj2d"  //用/是unix系统,用window系统是\,ru
// var inputDir = "F:\\test"
var resultFile = "result.txt";

function readFileList(dir, filesList = []) {
    const files = fs.readdirSync(dir);  //同步,dir为当前文件夹的路径,先执行完读取文件
    files.forEach((item, index) => {
        var fullPath = path.join(dir, item); //用于连接路径的语法，会正确使用当前系统的路径分隔符，如\分开
        // console.log("当前的文件路径---",fullPath);
        const stat = fs.statSync(fullPath);   //同步 //返回的是一个stat数组，如下面  //fs.statSyn里面的参数必须是路径
        if (stat.isDirectory()) {     //是否为目录  
            readFileList(path.join(dir, item), filesList);  //递归读取文件  //path.join(dir, item)
        } else {        
        	if(path.extname(fullPath) == ".txt"){
	            filesList.push(fullPath);                     
        	}        
        }        
    });
    return filesList;
}

function parsePattern(str){
	var index = str.indexOf("^")
	if(index >= 0){
		var compName = str.substr(0, index);
		var pa = str.substr(index + 1);
		// console.log(compName + "	" + pa);
		return [compName, pa];
	}
	return [];
}

function getType(filepath, patharr){
	var text = fs.readFileSync(filepath).toString();  //获取具体某一条
	
	if(patharr.length > 0){
		var name = patharr.shift();
		//<loader id="n0_d8n8" 
		//<component id="n142_h0x0" name="P_2" src="qku7qh" fileName="换/组件/xingyunzhuanpan/换/组件/转盘/zuanshi/zhuanpan3.xml" xy="757,155" touchable="false">
		var reg = `\<([^\\s]+).*name="${name}".*\>`;
		var ret = text.match(new RegExp(reg));
		// console.log(ret);
		console.assert(ret.length >= 2);
		var tagText = ret[0];
		var tagName = ret[1];

		if(patharr.length <= 0){
			return tagName;
		}
		else if(patharr.length > 0 && tagName == "component"){
			var next_comp_path = tagText.match(/fileName="(.*?)"/)[1];
			// console.log(next_comp_path);
			return getType(path.join(inputDir, next_comp_path), patharr);
		}
		else{
			console.log("error");
			return "";
		}
	}
	else{
		console.log("comppath cannot split");	
		return "";
	}
}

function translate_type(path_pattern, text){
	// var arr = [];
	// arr.push({key:"text", value:"文本"});
	// arr.push({key:"text", value:"对象"});
	// arr.push({key:"text", value:"控制器"});
	// arr.push({key:"text", value:"页"});
	// arr.push({key:"component", value:"组件"});
	// arr.push({key:"text", value:"对象"});
	// arr.push({key:"text", value:"按钮"});
	// arr.push({key:"text", value:"图形"});

	// var arr2 = []；
	var typeMap = {
		text: "文本",
		component: "组件",
		list: "列表",
		image: "图片",
		loader: "装载器",
		richtext: "富文本",
		// transition: "控制器",
		controller: "控制器",
		graph: "图形",
		group: "文本"
	}
	if(!typeMap[text]){
		console.log(text + ": " + path_pattern.trim() );
		return "对象"
	}
	return typeMap[text];
}

function run(){
	var files = [];
	readFileList(inputDir, files);
	console.log("当前打印-");
	console.log(files.length);

	var fileMap = {};        //类似json的一个表
	var sameNameFiles = {};  //重名文件
	for(var i = 0; i < files.length; ++i){
		var extension = path.extname(files[i]);
		var fileKey = path.basename(files[i],extension);

		if(!fileMap[fileKey]){
			fileMap[fileKey] = files[i];
		}
		else{
			if(!sameNameFiles[fileKey]){
				sameNameFiles[fileKey] = [];
				sameNameFiles[fileKey].push(fileMap[fileKey]);
			}
			sameNameFiles[fileKey].push(files[i]);
		}
		// console.log(fileKey);
	}

	// console.log("all xml:" + Object.keys(fileMap).length);
	// console.log("same name:" + Object.keys(sameNameFiles).length);
	for(var i in sameNameFiles){
		// console.log(`${i}:[${sameNameFiles[i].join(" , ")}]`);
	}


	for(var i in fileMap){
		// console.log(fileMap[i]);
	}

	// var ret = parsePattern("Main^n32/MainNv/MeiMv1/MainNv");
	fs.writeFileSync(resultFile, "");
	var text = fs.readFileSync("input.txt").toString();
	var list = text.split("\n");
	console.log("list的长度--",list.length);
	for(var i in list){
		var path_pattern = list[i];
		// console.log(path_pattern);

		var ret = parsePattern(path_pattern);
		var text = "";
		// console.log(ret);
		if(path_pattern.trim() == "#"){ //去除两端空白的字符串
			text = "#"
		}
		else if(ret.length > 0){
			try{
				var file = fileMap[ret[0]].trim();
				var patharr = ret[1].trim().split("/");
				var type = getType(file, patharr);
				
				// console.log(type);
				text = translate_type(path_pattern, type);
			}
			catch(e){
				text = path_pattern.trim() + " :error!"; 
			}
		}
		else{
			text = "nooooooo";
		}
		fs.writeFileSync(resultFile, path_pattern.trim() + "			" + text + "\n", {flag:'a'});
	}
}


run();
