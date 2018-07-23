var TIMESTEP = 0.5;
var scale;
var scaledRadius;

function setRoom() {
    var width = parseInt(document.getElementById("width").value);
    var height = parseInt(document.getElementById("length").value);

    document.getElementById("widthText").value = width;
    document.getElementById("lengthText").value = height;

    scaleWidth = ctx.canvas.width / (width * 1.25);
    scaleHeight = ctx.canvas.height / (height * 1.25);
    if (scaleWidth < scaleHeight) {
        scale = scaleWidth;
    } else {
        scale = scaleHeight;
    }

    scaledRadius = scale * robotRadius;

    room1 = new Room(-width / 2 - 2, -height / 2, width, height);

    var policy = document.getElementById("policy-select").value;

    robot1 = new Robot(room1, width / 2, height / 2, Math.PI / 3, policy);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawRoom(room1);
    drawRobot({x: width / 2, y: height / 2 - 1, heading: 3 * Math.PI / 2});
}

function manualDimInput() {
    var width = parseInt(document.getElementById("widthText").value);
    var height = parseInt(document.getElementById("lengthText").value);

    document.getElementById("width").value = width;
    document.getElementById("length").value = height;

    setRoom();
}

function run() {
    setRoom();

    var hours = document.getElementById("time").value;
    var time = parseFloat(hours) * 3600; // seconds

    for (var t = 0; t < time / TIMESTEP; t++) {
        robot1.update();
    }

    drawPath(robot1.path);

    // robot animation:
    //setInterval(function() {
    //    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //    drawPath(robot1.path);
    //    drawRobot(robot1);
    //    drawRoom(room1);

    //    robot1.update();
    //}, TIMESTEP * 1000);
}
