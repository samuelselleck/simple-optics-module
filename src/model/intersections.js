import { mult, sub, add, unitVecFromAngle, rotate,
    norm, length, crossSign, angleBetween, div, intersectionParameters,
    angle, reflect, boundAngle, dot} from '../utils/vectormath.js';
    

export function rayLineIntersect(ray, origin, angle, height) {

    let segment = mult(unitVecFromAngle(angle + Math.PI/2), height)
    let pos = sub(origin, div(segment, 2))
    let params = intersectionParameters(ray.p, ray.r, pos, segment)

    if (params) {
        if(params.s >= 0&& params.s <= 1) {
            return {dist: params.t,  segment: segment, ray, center: origin}
         }
    }
    return {dist: Infinity}
}

export function rayBoxIntersect(ray, origin, angle, height, width) {
    let closestIntersectionData = {dist: Infinity}
    for(let i = 0; i < 4; i++) {
        let a = i*Math.PI/2;
        let o = add(origin, mult(unitVecFromAngle(a + angle), (i % 2 == 1 ? height : width)/2))
        let intersectionData = rayLineIntersect(ray, o, a + angle,  i % 2 == 0 ? height : width)
        if(intersectionData.dist < closestIntersectionData.dist) {
            closestIntersectionData = intersectionData;
        }
    }
    return closestIntersectionData;
}

export function idealRefraction(intersectionData, focal, reflect, oneSided) {

    let cross = crossSign(intersectionData.segment, intersectionData.ray.r)
    let normal = norm(rotate(intersectionData.segment, cross*Math.PI/2))
    let angleIn = angleBetween(intersectionData.ray.r, normal);
            
    let p = add(intersectionData.ray.p, mult(intersectionData.ray.r, intersectionData.dist));
    if(cross > 0 && oneSided) {
        return {p}
    }
    let distVec = sub(intersectionData.center, p);
    let dist = length(distVec)*crossSign(distVec, intersectionData.ray.r);
    let angleOut = Math.atan(Math.tan(angleIn) - dist/focal);
    let r = rotate(normal, reflect ? (Math.PI - angleOut) : angleOut);
    return {p, r}
}

export function snellRefraction(intersectionData, n) {
    let cross = crossSign(intersectionData.segment, intersectionData.ray.r)
    let normal = norm(rotate(intersectionData.segment, cross*Math.PI/2))
    let angleIn = angleBetween(intersectionData.ray.r, normal);
    let inner = (cross > 0 ? n : 1/n)*Math.sin(angleIn)
    let angleOut;
    if (inner > -Math.PI/2 && inner < Math.PI/2) {
        angleOut = Math.asin(inner)
    } else {
        angleOut = Math.PI - angleIn;
    }
    let r = rotate(normal, angleOut)
    let p = add(intersectionData.ray.p, mult(intersectionData.ray.r, intersectionData.dist));
    return {r, p}
}
