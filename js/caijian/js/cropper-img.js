$(function() {
	! function() {
		var i = {
			aspectRatio: 1 / 1
		};
	}()
});
(function(c) {
	var Cro = function() {}
	c.extend(Cro.prototype, {
		orientation: null,
		simg: null,
		simg2: null,
		urldata: null,
		view: null,
		num: 0,
		sbx: null,
		sby: null,
		n: 0,
		yasuo: null,
		onReady: function() {
			var that = this;
			mui.init();
			that.bindEvent();
			that.view = plus.webview.currentWebview();

			that.simg = document.createElement("img");
			that.simg.setAttribute("id", "simg");
			document.body.appendChild(that.simg);

			var url = that.view.path;
			var img = document.createElement("img");
			img.setAttribute("src", url);
			console.log('原始截取图片路径: ' + url);
			
			//判断图片是否已经加载完，如果已经加载完，则执行下面的函数。
			img.addEventListener("load", function() {
				//调用EXIF解决，图片旋转90的问题
				EXIF.getData(img, function() {
					var orientation = EXIF.getAllTags(this).Orientation;
					
					//本地压缩图片。
					that.loadcopyImg( img, orientation, url );
					
				});
			})
		},
		cropperImg: function() {
			var that = this;
			$('#cropper-example-1 > img').cropper({
				aspectRatio: 1 / 1,	//长宽的比例
				autoCropArea: 0.5,	//拆减图片框框的大小
				strict: true,
				background: false,
				guides: false,
				highlight: false,
				dragCrop: false,
				movable: false,
				resizable: false,
				crop: function(data) {
					console.log('sssssssA: ' + JSON.stringify(data));
					that.urldata = that.base64(data);
				}
			});
		},
		loadcopyImg: function(img, opt,url) {	//本地处理图片。将图片进行压缩
			var that = this;
			var name="_doc/upload/F_ZDDZZ-1467602809090.jpg"; //_doc/upload/F_ZDDZZ-1467602809090.jpg  
            plus.zip.compressImage({
                    src:url,//src: (String 类型 )压缩转换原始图片的路径  
                    dst:name,//压缩转换目标图片的路径  
                    quality:20,//quality: (Number 类型 )压缩图片的质量.取值范围为1-100  
                    overwrite:true//overwrite: (Boolean 类型 )覆盖生成新文件  
                },  
                function(event) {   
                    //uploadf(event.target,divid);  
                    var path = name;//压缩转换目标图片的路径
                    console.log('本地压缩图片成功：' + event.target);
                    
                    that.yasuo = event.target;
                    
                    $("#im").attr("src", event.target );
					//调用截取框
					that.cropperImg();
					
                    return event.target;
                    /*
                    console.log('AAAAAAAA: ' + path );
                    imgArrayA.push( { 'name':"uploadkey"+indexA,'path':path } );
                    indexA++;
                    saveimage( event.target, divid, filename, path );*/  
                },function(error) {  
                    plus.nativeUI.toast("压缩图片失败，请稍候再试");  
            });  
			
			/*
			
			var that = this;
			//创建一个画布
			var canvas = document.createElement("canvas");
			var square = 500;	//清晰度
			var imageWidth, imageHeight;
			if (img.width > img.height) {
				imageHeight = square;
				imageWidth = Math.round(square * img.width / img.height);
			} else {
				imageHeight = square; //this.width;
				imageWidth = Math.round(square * img.width / img.height);
			}
			canvas.height = imageHeight;
			canvas.width = imageWidth;
			if (opt == 6) {
				that.num = 90;
			} else if (opt == 3) {
				that.num = 180;
			} else if (opt == 8) {
				that.num = 270;
			}
			if (that.num == 360) {
				that.num = 0;
			}

			var ctx = canvas.getContext("2d");
			ctx.translate(imageWidth / 2, imageHeight / 2);
			ctx.rotate(that.num * Math.PI / 180);
			ctx.translate(-imageWidth / 2, -imageHeight / 2);
			ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
			//document.getElementById("test").appendChild(canvas);
			var dataURL = canvas.toDataURL("image/jpeg", 1);
			console.log('sssssssssC:' + dataURL);
			return dataURL;*/
		},
		bindEvent: function() {
			document.getElementById("quxiao").addEventListener("click", function() {
				window.cro.view.close();
			});
			document.getElementById("xuanqu").addEventListener("click", function() {
				//window.cro.showFace(window.cro.urldata);
				window.cro.jieQu();
			});
		},
		base64: function(data) {
			var that = this;
			var img = document.getElementById("im");

			var canvas = document.createElement("canvas");	//创建一个绘制图像的 对象
			canvas.height = 200;
			canvas.width = 200;

			var bx = data.x;
			var by = data.y;

			var ctx = canvas.getContext("2d");	//设置绘制图像的模式为 2D展示
			ctx.drawImage(img, bx, by, data.width, data.height, 0, 0, 200, 200);
			var dataURL = canvas.toDataURL("image/jpeg", 0.5);
			
			var imageA = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
			console.log('hhhhhh:' + imageA);
			//return dataURL;
		},
		getdata: function() {
			var view1 = plus.webview.getWebviewById("modifyInfo.html");
			mui.fire(view1, 'headimg', {});
			window.cro.view.close();
		},
		jieQu: function(){
			console.log('截取开始');
			var that = this;
			plus.zip.compressImage({
			    src: that.yasuo, //src在这里是第一步Url里的src。也就是本地路径
			    dst: '_doc/upload/DDDD.jpg',
			    overwrite: true,
			    clip: {
			      top:'50%',
			      left:'30%',
			      width:'300px',
			      height:'300px'
			    }
			  },
			  function( event ) {
			  	console.log('截取后的图片路径：' + event.target);
			    $("#im").attr("src", event.target ); //压缩图片
			  }
			);
		},
		showFace: function(str) {
			console.log('dddddd' + JSON.stringify(str));
			str = str.replace("data:image/jpeg;base64,", "");
			str = str.replace("data:image/png;base64,", ""); //三星手机剪裁后的图片格式为png
			alert(str);
		}
	});
	window.cro = new Cro();
	c.plusReady(function() {
		window.cro.onReady();
	})
})(mui)