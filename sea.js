function initialize(){
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    c.style.cursor = "none";

    cursor = new Cursor(0, 0);

    paused = -1; // -1 = not paused, 1 = paused
    keys = []
    player = new Player( c.width / 2., c.height/2. );

    bullets = [];

    var music = new Audio("tangerine_dreams.mp3");
    //music.play();

    lastframe = Date.now();
    game_loop = setInterval( function(){loop()}, 1);
}

function sign(x){
    if (x > 0)
        return 1;
    return -1;
}

function loop(){
    now = Date.now();
    dt = (now - lastframe)/1000; // ms
    lastframe = now;

    if (paused == 1){
        draw();
        return;
    }

    player.heading = [0, 0];

    // input
    if (keys[65])
        player.heading[0] = -1;
    if (keys[68])
        player.heading[0] = 1;
    if (keys[83])
        player.heading[1] = 1;
    if (keys[87])
        player.heading[1] = -1;

    // make a new bullet
    if (now - player.last_bullet > player.max_time_since_bullet){
        dx = cursor.x - player.x;
        dy = cursor.y - player.y;
        vel = norm_vec( [dx, dy] );
        vel = mul_vec( 600, vel );
        b = new Bullet( player.x, player.y, vel[0], vel[1] );
        bullets.push(b);
        player.last_bullet = now;
    }

    player.update(dt);

    for (var i = 0; i < bullets.length; i++)
        bullets[i].update(dt)

    draw();

}

function draw(){
    ctx.fillStyle = "#002447";
    ctx.fillRect(0, 0, c.width, c.height);

    cursor.draw();
    player.draw();

    for (var i = 0; i < bullets.length; i++)
        bullets[i].draw();
}

function Cursor(x, y){
    this.x = x;
    this.y = y;

    this.draw = function(){
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3;

        var pi = Math.PI;

        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, pi/5 - pi/2, 4*pi/5 - pi/2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 6*pi/5 - pi/2, 9*pi/5 - pi/2);
        ctx.stroke();
    }
}

function Bullet(x, y, vx, vy){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    this.update = function(dt){
        this.x += vx * dt;
        this.y += vy * dt;
    }

    this.draw = function(){
        //ctx.fillStyle = "#FFFFFF";
        //ctx.fillRect( this.x - 5, this.y - 5, 10, 10 );
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 5;

        ctx.beginPath();
        a = 50;
        ctx.moveTo(this.x - this.vx/a, this.y - this.vy/a);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
}

function Player(x, y){
    this.x = x;
    this.y = y;

    this.size = 20;

    this.heading = [0, 0];

    this.vel = 150;

    this.max_time_since_bullet = 500; // ms
    this.last_bullet = 0;

    this.draw = function(){
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect( this.x - this.size/2, this.y - this.size/2,
                this.size, this.size );
    }

    this.update = function(dt){
        //v = this.heading;
        v = norm_vec( this.heading );
        v = mul_vec( dt*this.vel, v );
        this.x += v[0];
        this.y += v[1];

        this.x = Math.max(0, this.x);
        this.x = Math.min(c.width, this.x);
        this.y = Math.max(0, this.y);
        this.y = Math.min(c.height, this.y);
    }
}

function keyDown(e){
    //alert(e.keyCode);
    kc = e.keyCode;
    keys[kc] = true;

    if (kc == 80)
        paused *= -1;
}

function keyUp(e){
    keys[e.keyCode] = false;
}

function mouseMove(e){
    cursor.x = e.clientX - c.offsetLeft;
    cursor.y = e.clientY - c.offsetTop;
}
