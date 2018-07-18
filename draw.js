var ctx;
var xOffset = 0;
var yOffset = 0;
var robotRadius = 0.5;

function drawRobot(pose) {
    var centerX = pose.x;
    var centerY = pose.y;

    ctx.translate(centerX * scale + xOffset, centerY * scale + yOffset);
    ctx.rotate(pose.heading);

    ctx.strokeStyle = "black";

    // draw the circle
    ctx.beginPath();
    ctx.arc(0, 0, scaledRadius , 0, 2 * Math.PI);
    ctx.stroke();

    // draw a line across the front
    ctx.beginPath();
    //ctx.arc(0, 0, robotRadius, Math.PI / 6, 5 * Math.PI / 6);
    ctx.moveTo(scaledRadius / 2, -scaledRadius * Math.sqrt(3) / 2);
    ctx.lineTo(scaledRadius / 2, scaledRadius * Math.sqrt(3) / 2);
    ctx.stroke();

    // reset coordinate system
    ctx.rotate(-pose.heading);
    ctx.translate(-centerX * scale - xOffset, -centerY * scale - yOffset);
}

function drawPath(pts) {
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(pts[0].x * scale + xOffset, pts[0].y * scale + yOffset);
    for (var i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x * scale + xOffset, pts[i].y * scale + yOffset);
    }
    ctx.stroke();
}

function drawRoom(room) {
    ctx.strokeStyle = "black";
    ctx.translate(xOffset, yOffset);
    ctx.strokeRect(room.x * scale, room.y * scale, room.width * scale, room.height * scale);

    // reset coordinate system
    ctx.translate(-xOffset, -yOffset);
}

function ready() {
    ctx = document.getElementById("canvas").getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    xOffset = window.innerWidth / 2;
    yOffset = window.innerHeight / 2;

    ctx.lineWidth = 1;
}
