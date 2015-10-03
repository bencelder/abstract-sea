function initialize(){
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    c.style.cursor = "none";

    cursor = new Cursor(0, 0);

    paused = -1; // -1 = not paused, 1 = paused
    keys = []
    player = new Player( c.width / 2., c.height/2. );

    bullets = [];

    patrols = [];

    p = new Patrol(100, 100);
    patrols.push(p);

    var music = new Audio("tangerine_dreams.mp3");
    //music.play();

    lastframe = Date.now();
    game_loop = setInterval( function(){loop()}, 1);
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
    // (move to Player class?)
    if (keys[65])
        player.heading[0] = -1;
    if (keys[68])
        player.heading[0] = 1;
    if (keys[83])
        player.heading[1] = 1;
    if (keys[87])
        player.heading[1] = -1;

    player.update(dt);

    for (var i = 0; i < bullets.length; i++)
        bullets[i].update(dt);

    for (var i = 0; i < patrols.length; i++)
        patrols[i].update(dt);

    // check for destruction
    new_bullets = [];
    for (var i = 0; i < bullets.length; i++){
        b = bullets[i];
        if (b.collided)
            continue;
        new_bullets.push(b);
    }
    bullets = new_bullets;

    new_patrols = [];
    for (var i = 0; i < patrols.length; i++){
        p = patrols[i];
        if (now - p.created > p.duration)
            continue;
        if (p.health < 0)
            continue;
        new_patrols.push(p);
    }
    patrols = new_patrols;

    draw();

}

function draw(){
    ctx.fillStyle = "#002447";
    ctx.fillRect(0, 0, c.width, c.height);

    cursor.draw();
    player.draw();

    for (var i = 0; i < bullets.length; i++)
        bullets[i].draw();

    for (var i = 0; i < patrols.length; i++)
        patrols[i].draw();
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
