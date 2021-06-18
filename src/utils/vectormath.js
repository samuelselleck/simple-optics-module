const PI = Math.PI

export function mult(v, factor) {
    return {x: v.x*factor, y: v.y*factor}
}

export function div(v, factor) {
    return {x: v.x/factor, y: v.y/factor}
}

export function add(v1, v2) {
    return {x: v1.x + v2.x, y: v1.y + v2.y}
}

export function sub(v1, v2) {
    return {x: v1.x - v2.x, y: v1.y - v2.y}
}

export function dot(v1, v2) {
    return v1.x*v2.x + v1.y*v2.y;
}

export function cross(v1, v2) {
    return v1.x*v2.y - v1.y*v2.x;
}

export function crossSign(v1, v2) {
    return Math.sign(cross(v1, v2))
}

export function toRadians(angle) {
    return angle*PI/180;
}

export function toDegrees(angle) {
    return angle*180/PI;
}

export function angleBetween(v1, v2) {
    let angle = Math.atan2(v1.y, v1.x) - Math.atan2(v2.y, v2.x)
    if (angle > PI)        { angle -= 2 * PI; }
    else if (angle <= -PI) { angle += 2 * PI; }
    return angle
}

export function unitVecFromAngle(angle) {
    return {x: Math.cos(angle), y: Math.sin(angle)}
}

export function rotate(v, angle) {
    let sin = Math.sin(angle)
    let cos = Math.cos(angle)
    return {x: v.x*cos - v.y*sin, y: v.x*sin + v.y*cos}
}

export function lengthSquared(v) {
    return v.x*v.x + v.y*v.y;
}

export function length(v) {
    return Math.sqrt(lengthSquared(v))
}

export function norm(v) {
    return div(v, length(v))
}

export function project(v, u) {
    let n = norm(u)
    return mult(n, dot(p, n))
}

export function intersectionParameters(p1, v1, p2, v2) {
    let den = v1.x*v2.y - v1.y*v2.x;
    if (Math.abs(den) < 0.001) return null;

    let yt = p2.x - p1.x;
    let xt = p2.y - p1.y;
    let s = (v1.y*yt - v1.x*xt)/den
    let t = (v2.y*yt - v2.x*xt)/den
    return {s, t}
}


