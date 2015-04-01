!function(e,t){typeof module!="undefined"?module.exports=t():typeof define=="function"&&typeof define.amd=="object"?define(t):this[e]=t()}("domready",function(){var e=[],t,n=document,r=n.documentElement.doScroll,i="DOMContentLoaded",s=(r?/^loaded|^c/:/^loaded|^i|^c/).test(n.readyState);return s||n.addEventListener(i,t=function(){n.removeEventListener(i,t),s=1;while(t=e.shift())t()}),function(t){s?t():e.push(t)}})
var canvas;
var ctx;
var video = document.createElement('video');
	video.autoplay = true;




var errorCallback = function(e) {
			console.log('reeejected!', e);
		};




function init(){

	canvas = document.getElementById('canvas');
	resizeCanvas();
	
	window.addEventListener('resize', resizeCanvas);

	navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

	ctx = canvas.getContext('2d');
	requestUserMedia();
}	

function requestUserMedia(){
	if (navigator.getUserMedia) {
	  	navigator.getUserMedia({audio: false, video: true}, function(localMediaStream) {
	    video.src = window.URL.createObjectURL(localMediaStream);
	    video.addEventListener('loadedmetadata', function(){

		    video.width = video.videoWidth;
		    video.height = video.videoHeight;

		    var dim = video.width >= video.height ? video.height : video.width;
		    canvas.height = canvas.width = dim;
		    resizeCanvas();
		    window.requestAnimationFrame(draw);
	    });
	  }, errorCallback);
	} else {
	  video.src = 'somevideo.webm'; // fallback.
	}
}

function resizeCanvas(){
	var factor = document.body.clientHeight <= document.body.clientWidth ? document.body.clientHeight / canvas.height : document.body.clientWidth / canvas.width;
	canvas.setAttribute('style', 'transform: scale(' + factor + ')')
}

function clipside(i){
	console.log(i);
	ctx.beginPath();
	var r = (canvas.clientHeight / 2) * 0.980785;
	var rr = (canvas.clientHeight / 4) * 0.980785;
	var offset = canvas.clientHeight / 2;

	
		var angle = 2 * Math.PI * (i + 0.5) / 16;
		var x = rr * Math.cos(angle) + r;
		var y = rr * Math.sin(angle) + r + 13;

		ctx.moveTo(x, y);
		var xx = r * Math.cos(angle) + r;
		var yy = r * Math.sin(angle) + r + 13;
		ctx.lineTo(xx, yy);
		var aa = 2 * Math.PI * (i + 1.5) / 16;
		var xxx = r * Math.cos(aa) + r;
		var yyy = r * Math.sin(aa) + r + 13;
		var xxxx = rr * Math.cos(aa) + r;
		var yyyy = rr * Math.sin(aa) + r + 13;
		ctx.lineTo(xxx, yyy);
		ctx.lineTo(xxxx, yyyy);
	
	ctx.closePath();
	ctx.clip();
}

function clipedge(){

	ctx.beginPath();

	var r = (canvas.clientHeight / 2) * 0.980785;

	for(var i = 0; i < 16; i++){
		var angle = 2 * Math.PI * (i + 0.5) / 16;
		var x = r * Math.cos(angle) + r;
		var y = r * Math.sin(angle) + r + 13;
		i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
	}
	ctx.closePath();
	ctx.clip();
}

function draw() {
	ctx.save();
	clipedge();
	ctx.drawImage(video, (video.videoWidth - video.videoHeight) / 2, 0, video.videoWidth, video.videoHeight, 0, 0, video.videoWidth, video.videoHeight);
	ctx.restore();
	for(var i = 0; i < 16; i ++){
		ctx.save();
		clipside(i);
		ctx.drawImage(video, ((video.videoWidth - video.videoHeight) / 2) + (i * 16), i * 16, video.videoWidth, video.videoHeight, 0, 0, video.videoWidth, video.videoHeight);
		ctx.restore();
	};

	window.setTimeout(function(){window.requestAnimationFrame(draw)}, 100);
}

domready(function(){
	init();
})
