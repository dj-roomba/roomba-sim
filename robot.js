var TURN_SPEED = 10;
var FORWARD_SPEED = 2 / 12;

function Robot(room, startX, startY, startHeading) {
    this.room = room;
    this.x = startX + room.x;
    this.y = startY + room.y;
    this.heading = startHeading;
    this.targetHeading = startHeading;
    this.turning = false;

    this.path = [{x: this.x, y: this.y}];

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

        if (this.turning) {
            var direction = Math.sign(this.targetHeading - this.heading);
            this.turn(TURN_SPEED * direction);

            if (this.targetHeading - this.heading < TURN_SPEED * TIMESTEP) {
                this.turning = false;
            }
        } else {
            this.drive(FORWARD_SPEED);
            if (this.hitWall()) {
                this.newDirection();
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
