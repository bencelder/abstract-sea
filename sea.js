function initialize(){
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");

    keys = []
    player = new Player( c.width / 2., c.height/2. );

    game_loop = setInterval( function(){loop()}, 1);
}

function loop(){
    ctx.fillStyle = "#263238";
    ctx.fillRect(0, 0, c.width, c.height);

    if (keys[65])
        player.x -= 1;
    if (keys[68])
        player.x += 1;
    if (keys[83])
        player.y += 1;
    if (keys[87])
        player.y -= 1;

    player.draw();
}

function Player(x, y){
    this.x = x;
    this.y = y;

    this.draw = function(){
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect( this.x, this.y, 10, 10 );
    }
}

function keyDown(e){
    //alert(e.keyCode);
    keys[e.keyCode] = true;
}

function keyUp(e){
    keys[e.keyCode] = false;
}
