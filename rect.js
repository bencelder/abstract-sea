function Rect(left, rtop, width, height){
    this.left = left;
    this.rtop = rtop; // top is a keyword in js
    this.width = width;
    this.height = height;
}

// checks if point p is in rect r
function collidePoint( p, r ){
    if (p[0] < r.left || p[0] > r.left + r.width
            || p[1] < r.rtop || p[1] > r.rtop + r.height)
        return false;
    return true;
}
