var fs  = require('fs')
var path=require('path')

var  readPath = "F:\\test"
var  writeFile = "F:\\test\\moretime.txt";
var  writeFileError = "F:\\test\\write.txt";

//读取文件
function readPathModel(dir,feathList=[]){
	const fils = fs.readdirSync(dir);
	fils.forEach((item,index)=>{
		var filsPath = path.join(dir,item);
		// console.log("裂开---",filsPath);
		const stat =  fs.statSync(filsPath);
		if(stat.isDirectory()){
			readPathModel(filsPath,feathList);
		}else{
			if(path.extname(filsPath) == ".txt"){
				feathList.push(filsPath);
			}
		}
	})
	return feathList;
}

function run (){
	const fils  =  readPathModel(readPath)  //此刻把所有的txt文件存下来放进一个数组里
	// console.log("跑起来---",fils);
	WriteFilesModel();
}

//写入文件
function WriteFilesModel(){
	var writeList = []; 
	var text = fs.readFileSync("F:\\test\\geci.txt").toString();  
	var list = text.split("\n");
	// fs.writeFileSync(writeFile,list);
	console.log("当前list的长度",list.length);
	for(var i in list){
		var indexStr = list[i];
		var parse = parsePattern(indexStr);  //获取到每行具体的信息，已经通过解析分解了
		writeList.push(parse);//自己想法创个数组存起来直接读出来 ：1
	}
	fs.writeFileSync(writeFile,writeList); //同上面直接将数组写进去 ：1
}

//解析模式,对字符串进行处理
function parsePattern(str){
	var index = str.indexOf("^");  //index指的是^前面有多少个字母
	// console.log("index----",index);
	if(index >= 0){  //证明^前面有东西存在
		var packname = str.substr(0,index);  //str.substr证明的是获取方位
		var suffix = str.substr(index+1)
		return [packname,suffix]
	}
	return []; //就证明index不存在，返出空数组
}

//当时获得对字段进行的处理
function chuli(str,text,writeList){
	var ret = parsePattern(str);
	if(str.trim() == "#"){
		text = "#"
	}else if(ret.length > 0){
		try{
			var file = writeList[ret[0]].trim();
			var patharr = ret[1].trim().split("/"); 
			var type = getType(file,patharr);
		}
		catch(e){

		}
	}
}

run()