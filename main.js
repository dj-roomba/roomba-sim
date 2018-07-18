var TIMESTEP = 0.5;
var scale;
var scaledRadius;

function run() {
    var width = 25;
    var height = 15;

    scale = height * 3;
    scaledRadius = scale * robotRadius;

    room1 = new Room(-width / 2, -height / 2, width, height);

    robot1 = new Robot(room1, width / 2, height / 2, Math.PI / 3);

    var time = 4 * 3600; // seconds

    for (var t = 0; t < time / TIMESTEP; t++) {
        robot1.update();
    }

    drawPath(robot1.path);
    drawRoom(room1);
    drawRobot({x: width / 2 + 2, y: height / 2 - 1, heading: 3 * Math.PI / 2});

    //setInterval(function() {
    //    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //    drawPath(robot1.path);
    //    drawRobot(robot1);
    //    drawRoom(room1);

    //    robot1.update();
    //}, TIMESTEP * 1000);
}
