var canDraw = false;
var clr = "red";
var strokeSize = 2;
var allContexts = new Array();
var contextIndex = -1;

var x = null;
var y = null;
var xold = null;
var yold = null;

var draw = drawWithCircles;

$(document).ready(function() {
	$('#myCanvas').mousemove(mouseMoveHandler);
	$('#myCanvas').mousedown(mouseDownHandler);
	$('#myCanvas').mouseup(mouseUpHandler);
	
	$('#undo').click(undo);
	$('#clear').click(clear);
	
	$('.btnClr').click(changeColor);
	
	$('.btnPencil').click(changePencil);
	
	$('#strokeSize').change(changeStrokeSize);
	
	// Salvar canvas em blanco
	saveStep();
});

function mouseDownHandler(e) {
	canDraw = true;
	saveStep();
}

function mouseUpHandler(e) {
	canDraw = false;
}

function mouseMoveHandler(e) {
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	
	xold = x;
	yold = y;
	
	x = e.pageX - $('#myCanvas').offset().left;
	y = e.pageY - $('#myCanvas').offset().top;
	
	if (xold == null && yold == null) {
		xold = x; yold = y;
	}

	if (canDraw) {
		draw(ctx, xold, yold, x, y, setColor(), strokeSize > 0 ? strokeSize : parseInt(Math.random() * 18) + 2);
	}
}

function undo() {
	if (contextIndex >= 0) {
		restoreStep();
	}
}

function clear() {
	saveStep();
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fill();
}

function saveStep() {
	allContexts[++contextIndex] = document.getElementById('myCanvas').toDataURL();
}

function restoreStep() {
	var img = new Image();
	img.src = allContexts[contextIndex--];
	
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fill();
	
	ctx.drawImage(img, 0, 0);
}

function changeColor() {
	clr = $(this).attr('class').replace('btn btn-xs btnClr', '').trim();
}

function changePencil() {
	var pencil = $(this).attr('class').replace('btn btn-xs btnPencil ', '').trim();
	switch(pencil) {
		case 'fill':
			draw = fill;
			break;
		case 'lines':
			draw = drawWithLines;
			break;
		case 'circles':
		default:
			draw = drawWithCircles;
	}
}

function setColor() {
	var intColor = parseInt(Math.random() * 255);
	switch(clr) {
		case "red":
			return "rgba(" + intColor + ", 0, 0, 0.5)";
		case "yellow":
			return "rgba(" + intColor + ", " + intColor + ", 0, 0.5)";
		case "green":
			return "rgba(" + 0 + ", " + intColor + ", 0, 0.5)";
		case "blue":
			return "rgba(0, 0, " + intColor + ", 0.5)";
		case "black":
			return "rgba(0, 0, 0, 0.5)";
		case "white":
			return "rgba(255, 255, 255, 0.5)";
		case "special":
		default:
			return "rgba(" + parseInt(Math.random() * 255) + ", " + parseInt(Math.random() * 255) + ", " + parseInt(Math.random() * 255) + ", 0.5)";
	}
}

function changeStrokeSize() {
	strokeSize = $('#strokeSize').val();
	$('#strokeSizeLabel').html(strokeSize > 0 ? strokeSize : 'random');
}

function drawWithCircles(ctx, xold, yold, x, y, color, width) {
	var radius = width / 2;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
	ctx.fill();
}

function drawWithLines(ctx, xold, yold, x, y, color, width) {
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	
	ctx.beginPath();
	ctx.moveTo(xold, yold);
	ctx.lineTo(x, y);
	ctx.closePath();
	ctx.stroke();	
}

function fill(ctx, xold, yold, x, y, color, width) {
	var canvas = document.getElementById('myCanvas');
	var fillWidth = canvas.width;
	var fillHeight = canvas.height;
	
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, fillWidth, fillHeight);
	ctx.fill();
}