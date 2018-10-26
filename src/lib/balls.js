let balls = [];
let startStopFlag = null;

function Ball(canvasContainer, x, y, id, color, aoa, weight) {
    this.posX = x; // cx
    this.posY = y; // cy
    this.color = color;
    this.radius = weight;
    this.jumpSize = 2;
    this.canvasContainer = canvasContainer;
    this.id = id;
    this.aoa = aoa;
    this.weight = weight;

    if (!this.aoa)
        this.aoa = Math.PI / 7;
    if (!this.weight)
        this.weight = 10;
    this.radius = this.weight;

    let thisobj = this;

    this.vx = Math.cos(thisobj.aoa) * thisobj.jumpSize; // velocity x
    this.vy = Math.sin(thisobj.aoa) * thisobj.jumpSize; // velocity y

    this.Draw = function () {
        let canvasContainer = thisobj.canvasContainer;
        let ball = document.getElementById(thisobj.id);

        if (!ball) {
            ball = document.createElement('div');
            ball.style.width = thisobj.radius*2+'px';
            ball.style.height = thisobj.radius*2+'px';
            ball.style.background = thisobj.color;
            ball.classList.add('ball');
            ball.setAttribute('id', thisobj.id);
            canvasContainer.appendChild(ball);
        }

        ball.style.left = thisobj.posX - thisobj.radius+'px';
        ball.style.top = thisobj.posY - thisobj.radius+'px';
    };

    this.Move = function () {
        let canvasContainer = thisobj.canvasContainer;

        thisobj.posX += thisobj.vx;
        thisobj.posY += thisobj.vy;

        if (canvasContainer.offsetWidth <= (thisobj.posX + thisobj.radius)) {
            thisobj.posX = canvasContainer.offsetWidth - thisobj.radius - 1;
            thisobj.aoa = Math.PI - thisobj.aoa;
            thisobj.vx = -thisobj.vx;
        }

        if (thisobj.posX < thisobj.radius) {
            thisobj.posX = thisobj.radius+1;
            thisobj.aoa = Math.PI - thisobj.aoa;
            thisobj.vx = -thisobj.vx;
        }

        if (canvasContainer.offsetHeight < (thisobj.posY + thisobj.radius)) {
            thisobj.posY = canvasContainer.offsetHeight - thisobj.radius - 1;
            thisobj.aoa = 2 * Math.PI - thisobj.aoa;
            thisobj.vy = -thisobj.vy;
        }

        if (thisobj.posY < thisobj.radius) {
            thisobj.posY = thisobj.radius+1;
            thisobj.aoa = 2 * Math.PI - thisobj.aoa;
            thisobj.vy = -thisobj.vy;
        }

        if (thisobj.aoa > 2 * Math.PI)
            thisobj.aoa = thisobj.aoa - 2 * Math.PI;
        if (thisobj.aoa < 0)
            thisobj.aoa = 2 * Math.PI + thisobj.aoa;

        thisobj.Draw();
    };
}

function CheckCollision(ball1, ball2) {
    let absx = Math.abs(parseFloat(ball2.posX) - parseFloat(ball1.posX));
    let absy = Math.abs(parseFloat(ball2.posY) - parseFloat(ball1.posY));

    let distance = (absx * absx) + (absy * absy);
    distance = Math.sqrt(distance);

    if (distance < (parseFloat(ball1.radius) + parseFloat(ball2.radius))) {
        return true;
    }
    return false;
}

function ProcessCollision(ball1, ball2) {

    if (ball2 <= ball1)
        return;
    if (ball1 >= (balls.length-1) || ball2 >= balls.length )
        return;

    ball1 = balls[ball1];
    ball2 = balls[ball2];

    if ( CheckCollision(ball1, ball2) ) {
        let vx1 = (ball1.vx * (ball1.weight - ball2.weight)
            + (2 * ball2.weight * ball2.vx )) / (ball1.weight + ball2.weight);
        let vy1 = (ball1.vy * (ball1.weight - ball2.weight)
            + (2 * ball2.weight * ball2.vy)) / (ball1.weight + ball2.weight);
        let vx2 = (ball2.vx * (ball2.weight - ball1.weight)
            + (2 * ball1.weight * ball1.vx)) / (ball1.weight + ball2.weight);
        let vy2 = (ball2.vy * (ball2.weight - ball1.weight)
            + (2 * ball1.weight * ball1.vy)) / (ball1.weight + ball2.weight);

        ball1.vx = vx1;
        ball1.vy = vy1;
        ball2.vx = vx2;
        ball2.vy = vy2;

        while (CheckCollision(ball1, ball2)) {
            ball1.posX += ball1.vx;
            ball1.posY += ball1.vy;

            ball2.posX += ball2.vx;
            ball2.posY += ball2.vy;
        }
        ball1.Draw();
        ball2.Draw();
    }
}

export function Initialize(container, ballsAmount) {
    const canvasContainer = container;
    const colors = [
        '#1f77b4',
        '#aec7e8',
        '#ff7f0e',
        '#ffbb78',
        '#2ca02c',
        '#98df8a',
        '#d62728',
        '#ff9896',
        '#9467bd',
        '#c5b0d5',
        '#8c564b',
        '#c49c94',
        '#e377c2',
        '#f7b6d2',
        '#7f7f7f',
        '#c7c7c7',
        '#bcbd22',
        '#dbdb8d',
        '#17becf',
        '#9edae5',
        '#1f77b4',
        '#aec7e8',
        '#ff7f0e',
        '#ffbb78',
        '#2ca02c',
        '#98df8a'
    ];

    for (let i = 0; i < ballsAmount; ++i) {
        balls.push(new Ball(canvasContainer, 20*i, 20*i, 'n'+(i+1).toString(), colors[i], Math.PI / (i+1), (i%2) === 0 ? 10 : (10+i)));
    }

    for (let i = 0; i < balls.length; ++i) {
        balls[i].Draw();
    }

    return canvasContainer;
}

export function StartStopGame() {
    if (startStopFlag == null) {
        let timer = setTimeout(function tick() {
            for (let i = 0; i < balls.length; ++i) {
                balls[i].Move();
                for (let j = i + 1; j < balls.length; ++j) {
                    ProcessCollision(i, j);
                }
            }

            timer = setTimeout(tick, 15);

            if (startStopFlag == null) {
                clearTimeout(timer);
                return true;
            }
            else {
                return false;
            }

        }, 15);

        startStopFlag = 1;
    }
    else {
        startStopFlag = null;
    }
}

export function RemoveBalls(container) {
    let canvasContainer = container;

    while (canvasContainer.firstChild) {
        canvasContainer.removeChild(canvasContainer.firstChild);
    }

    startStopFlag = null;

    balls.splice(0, balls.length);
    Initialize(canvasContainer, 0);
}