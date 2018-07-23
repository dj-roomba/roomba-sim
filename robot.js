var TURN_SPEED = 10;
var FORWARD_SPEED = 2 / 12;
var PATH_DISTANCE_THRESHOLD = 0.1;
var POINTS_AT_A_TIME = 1000;

function Robot(room, startX, startY, startHeading, policy) {
    this.room = room;
    this.x = startX + room.x;
    this.y = startY + room.y;
    this.heading = startHeading;
    this.targetHeading = startHeading;
    this.turning = false;
    this.policy = policy;

    this.startX = this.x;
    this.startY = this.y;

    this.path = [{x: this.x, y: this.y}];

    // generate an array of points, 0.1ft apart
    this.allPts = [];
    for (var x = room.x + 0.5; x < room.x + room.width - 0.5; x += 0.5) {
        for (var y = room.y + 0.5; y < room.y + room.height - 0.5; y += 0.5) {
            this.allPts.push({x: x, y: y});
        }
    }

    this.nearPts = [];

    this.newDirection = function () {
        //this.turning = true;

        var lower = this.heading + 3 * Math.PI / 4;
        var upper = this.heading + 5 * Math.PI / 4;

        //this.heading = Math.random() * (upper - lower) + lower;
        this.heading = this.supplementaryHeading() + (Math.random() * 2 - 1) * 0.1;
        //this.heading = this.supplementaryHeading() + 0.005;
    }

    this.update = function () {
        //record this as a point in the path
        this.path.push({x: this.x, y: this.y});

        if (this.policy == "random") {

            // RANDOM DRIVING POLICY
            this.drive(FORWARD_SPEED);
            if (this.hitWall()) {
                var lower = this.heading + 3 * Math.PI / 4;
                var upper = this.heading + 5 * Math.PI / 4;
                this.heading = Math.random() * (upper - lower) + lower;
            }

        } else if (this.policy == "supp") {

            // SUPPLEMENTARY DRIVING POLICY
            this.drive(FORWARD_SPEED);
            if (this.hitWall()) {
                this.heading = this.supplementaryHeading();
            }

        } else if (this.policy == "supp-static-fuzz") {

            // SUPPLEMENTARY + STATIC FUZZ DRIVING POLICY
            this.drive(FORWARD_SPEED);
            if (this.hitWall()) {
                this.heading = this.supplementaryHeading() + 0.005;
            }

        } else if (this.policy == "supp-rand-fuzz") {

            // SUPPLEMENTARY + RANDOM FUZZ DRIVING POLICY
            this.drive(FORWARD_SPEED);
            if (this.hitWall()) {
                this.heading = this.supplementaryHeading() + (Math.random() * 2 - 1) * 0.1;
            }

        } else if (this.policy == "spiral") {

            // SPIRAL DRIVING POLICY
            var distFromStart = Math.sqrt(Math.pow(this.x - this.startX, 2) +
                Math.pow(this.y - this.startY, 2));
            this.heading = 10 * distFromStart;

            this.drive(FORWARD_SPEED);

            if (this.hitWall()) {
                this.policy = "pursue-empty";
            }

        } else if (this.policy == "pursue-empty") {

            // PURSUE EMPTY AREA POLICY

            if (this.nearPts.length <= POINTS_AT_A_TIME) {
                // sort allPts by distance to the robot
                var robotX = this.x;
                var robotY = this.y;
                var robotHeading = this.heading;
                this.allPts.sort(function (a, b) {
                    var distA = Math.sqrt(Math.pow(a.x - robotX, 2) +
                        Math.pow(a.y - robotY, 2));
                    var distB = Math.sqrt(Math.pow(b.x - robotX, 2) +
                        Math.pow(b.y - robotY, 2));
                    var distScore = distA - distB;

                    var newHeadingA = Math.atan2(a.y - robotY, a.x - robotX);
                    var newHeadingB = Math.atan2(b.y - robotY, b.x - robotX);
                    var headingDiffA = Math.abs(newHeadingA - robotHeading);
                    var headingDiffB = Math.abs(newHeadingB - robotHeading);
                    var headingScore = headingDiffA - headingDiffB;

                    return distScore + 100 * headingScore;
                });
                this.nearPts = this.nearPts.concat(this.allPts.splice(0, POINTS_AT_A_TIME));
            }

            // sort allPts by distance to the robot
            var robotX = this.x;
            var robotY = this.y;
            var robotHeading = this.heading;
            this.nearPts.sort(function (a, b) {
                var distA = Math.sqrt(Math.pow(a.x - robotX, 2) +
                    Math.pow(a.y - robotY, 2));
                var distB = Math.sqrt(Math.pow(b.x - robotX, 2) +
                    Math.pow(b.y - robotY, 2));
                var distScore = distA - distB;

                var newHeadingA = Math.atan2(a.y - robotY, a.x - robotX);
                var newHeadingB = Math.atan2(b.y - robotY, b.x - robotX);
                var headingDiffA = Math.abs(newHeadingA - robotHeading)
                var headingDiffB = Math.abs(newHeadingB - robotHeading)
                var headingScore = headingDiffA - headingDiffB;

                return distScore + 2 * headingScore;
            });

            // go through allPts in order, and for each one find out if it is
            // far enough from all points on the path to be considered empty
            var i = 0;
            var nextPt;
            var farEnough = false;
            while (!farEnough && i < this.nearPts.length) {
                nextPt = this.nearPts[i];
                var j = this.path.length - 1;

                farEnough = true;
                do {
                    var pathPt = this.path[j];
                    var dist = Math.sqrt(Math.pow(nextPt.x - pathPt.x, 2) +
                        Math.pow(nextPt.y - pathPt.y, 2));
                    if (dist <= PATH_DISTANCE_THRESHOLD) {
                        farEnough = false;
                    }

                    j--;
                } while (j && farEnough)

                // since the path never loses points, points that have been
                // deemed too close can be removed from future consideration
                if (!farEnough) {
                    this.nearPts.splice(i, 1);
                }
            }

            var directionToNextPt = Math.atan2(nextPt.y - this.y, nextPt.x - this.x);

            this.heading = directionToNextPt;
            this.drive(FORWARD_SPEED);

            console.log("x: " + this.x.toFixed(2) + " -> " + nextPt.x);
            console.log("y: " + this.y.toFixed(2) + " -> " + nextPt.y);

            // stop once everything has been covered
            if (this.allPts.length == 0 && this.nearPts.length == 0) {
                this.policy = "";
            }
        }
    }

    this.supplementaryHeading = function () {
        var leftDist = this.x - this.room.x;
        var rightDist = this.room.x + this.room.width - this.x;
        var topDist = this.y - this.room.y;
        var bottomDist = this.room.y + this.room.height - this.y;

        var newHeading = Math.PI - this.heading;

        // if it's a horizontal wall
        if (topDist < leftDist && topDist < rightDist
            || bottomDist < leftDist && bottomDist < rightDist) {
            newHeading += Math.PI;
        }

        return newHeading;
    }

    this.hitWall = function () {
        var nextX = this.x + FORWARD_SPEED * Math.cos(this.heading) * TIMESTEP;
        var nextY = this.y + FORWARD_SPEED * Math.sin(this.heading) * TIMESTEP;

        var leftDist = nextX - this.room.x;
        var rightDist = this.room.x + this.room.width - nextX;
        var topDist = nextY - this.room.y;
        var bottomDist = this.room.y + this.room.height - nextY;

        if (leftDist <= robotRadius || rightDist <= robotRadius ||
            topDist <= robotRadius || bottomDist <= robotRadius) {
            return true;
        } else {
            return false;
        }
    }

    this.drive = function (speed) {
        this.x += speed * Math.cos(this.heading) * TIMESTEP;
        this.y += speed * Math.sin(this.heading) * TIMESTEP;
    }

    this.turn = function (speed) {
        this.heading += speed * TIMESTEP;
    }
}
