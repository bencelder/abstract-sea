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

    this.collided = false;

    this.update = function(dt){
        this.x += vx * dt;
        this.y += vy * dt;

        if (this.x < 0 || this.y < 0
                || this.x > c.width
                || this.y > c.height)
            this.collided = true;

    }

    this.draw = function(){
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 5;

        ctx.beginPath();
        a = 30;
        ctx.moveTo(this.x - this.vx/a, this.y - this.vy/a);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
}

function Patrol(x, y){
    this.x = x;
    this.y = y;

    this.size = 20;

    this.hitbox = new Rect(this.x - this.size/2, this.y - this.size/2,
            this.size, this.size);

    this.update_hitbox = function(){
        this.hitbox.left = this.x - this.size/2;
        this.hitbox.rtop = this.y - this.size/2;
    }

    this.vel = 75; // should be less than player.vel

    this.heading = [0, 0];

    this.health = 5;

    this.duration = 10000;
    this.created = Date.now();

    this.collide = function(){
        for (var i = 0; i < bullets.length; i++){
            b = bullets[i];
            if (collidePoint( [b.x, b.y], this.hitbox )){
                this.health -= 1;
                bullets[i].collided = true;
            }
        }
    }

    this.update = function(dt){
        var v = sub_vec([player.x, player.y], [this.x, this.y] );
        this.heading = norm_vec( v );

        this.x += dt * this.vel * this.heading[0];
        this.y += dt * this.vel * this.heading[1];

        this.update_hitbox();


        this.collide();
    }

    this.draw = function(){
        ctx.fillStyle = "#000000";
        ctx.fillRect( this.hitbox.left, this.hitbox.rtop,
                this.hitbox.width, this.hitbox.height );
    }
}

function Player(x, y){
    this.x = x;
    this.y = y;

    this.size = 20;

    this.heading = [0, 0];

    this.vel = 150;

    this.max_time_since_bullet = 100; // ms
    this.last_bullet = 0;

    this.draw = function(){

        pc = polar_vec( this.heading );
        r = pc[0];
        theta = pc[1];

        ctx.translate(this.x, this.y);
        ctx.rotate(theta);

        var width = 20;
        var length = 40;

        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect( - length/2, -width/2,
                length, width);
        ctx.beginPath();
        ctx.arc( length/2, 0, width/2, -Math.PI/2, Math.PI/2 );
        ctx.fill();

        ctx.beginPath();
        ctx.arc( length/5, 0, width/2 - 1, 0, 2*Math.PI );
        ctx.fill();

        ctx.rotate(-theta);
        ctx.translate(-this.x, -this.y);
    }

    this.update = function(dt){

        // input
        this.heading = [0, 0];
        if (keys[65])
            this.heading[0] = -1;
        if (keys[68])
            this.heading[0] = 1;
        if (keys[83])
            this.heading[1] = 1;
        if (keys[87])
            this.heading[1] = -1;

        // make a new bullet
        if (now - this.last_bullet > this.max_time_since_bullet){
            dx = cursor.x - this.x;
            dy = cursor.y - this.y;
            vel = norm_vec( [dx, dy] );
            vel = mul_vec( 600, vel );
            b = new Bullet( this.x, this.y, vel[0], vel[1] );
            bullets.push(b);
            this.last_bullet = now;
        }

        // move
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
