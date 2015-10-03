function add_vec( v1, v2 ){
    v = [];
    for (var i = 0; i < v1.length; i++)
        v.push( v1[i] + v2[i] );
    return v;
}

function sub_vec( v1, v2 ){
    v = [];
    for (var i = 0; i < v1.length; i++)
        v.push( v1[i] - v2[i] );
    return v;
}

function dot_vec( v1, v2 ){
    sum = 0;
    for (var i = 0; i < v1.length; i++)
        sum += v1[i] * v2[i] ;
    return sum;
}

function mul_vec( a, v1 ){
    v = [];
    for (var i = 0; i < v1.length; i++)
        v.push( a * v1[i] );
    return v;
}

function norm_vec( v1 ){
    mag = dot_vec(v1, v1);
    mag = Math.sqrt(mag);

    if (mag == 0)
        return [0, 0];

    v =  mul_vec( 1./mag, v1 );
    return v;
}
