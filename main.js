var TIMESTEP = 1;
var scale;
var scaledRadius;

var interval;
var running;

function setRoom() {
    clearInterval(interval);

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

    robot1 = new Robot(room1, width / 2, height / 2, Math.PI / 6, policy);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawRoom(room1);
    drawRobot(robot1);
}

function manualDimInput() {
    var width = parseInt(document.getElementById("widthText").value);
    var height = parseInt(document.getElementById("lengthText").value);

    document.getElementById("width").value = width;
    document.getElementById("length").value = height;

    setRoom();
}

function run2() {
    setRoom();

    var hours = document.getElementById("time").value;
    var time = parseFloat(hours) * 3600; // seconds

    running = true;
    for (var t = 0; t < time / TIMESTEP; t++) {
        if (running) {
            robot1.update();
        } else {
            break;
        }
    }

    drawPath(robot1.path);
}

function run() {
    setRoom();

    var hours = document.getElementById("time").value;
    var time = parseFloat(hours) * 3600; // seconds

    var running = true;

    // robot animation:
    var t = 0;
    interval = setInterval(function() {
        if (t * TIMESTEP < time && running) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            drawPath(robot1.path);
            drawRobot(robot1);
            drawRoom(room1);

            robot1.update();

            var hours = parseInt(t * TIMESTEP / 3600);
            var min = parseInt((t * TIMESTEP / 60) % 60);
            document.getElementById("elapsed").innerText = hours + "h " + min + "m";
        } else {
            clearInterval(interval);
        }

        console.log(t);

        t++;
    }, 1);
}

function ud(num) {
    for (var i = 0; i < num; i++) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        drawPath(robot1.path);
        drawRobot(robot1);
        drawRoom(room1);

        robot1.update();
    }
}
