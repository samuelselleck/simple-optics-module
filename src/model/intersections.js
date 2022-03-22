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
        if(intersectionData.dist > 1e-6 && intersectionData.dist < closestIntersectionData.dist) {
            closestIntersectionData = intersectionData;
        }
    }
    return closestIntersectionData;
}

export function raySurfIntersect(ray, origin, angle, height, curvature){
    let x = 100; 
    let segmentLength = 2*Math.PI*curvature*2*Math.asin(height/2/curvature)/360/x;
    let closestIntersectionData = {dist: Infinity}
    let intersectionData;
    if(curvature==0){
        return rayLineIntersect(ray, origin, angle, height);
    }
    else if(curvature < 0){
        //let segmentLength = Math.tan(Math.PI/x)*2*height;
        for(let i = 0; i < x; i++) {
        let a = 45//i*2*Math.asin(height/2/curvature);
        let o = add(origin, mult(unitVecFromAngle(-a + angle), curvature))
        intersectionData = rayLineIntersect(ray, o, a,  segmentLength)
        if(intersectionData.dist > 1e-6 && intersectionData.dist < closestIntersectionData.dist) {
            closestIntersectionData = intersectionData;
        //for(let i=0; i<x; i++){
          //  let a = (x-i)*Math.asin(height/2/curvature)/x/2
            //let o = add(origin, mult(unitVecFromAngle(a + angle),curvature))
            //intersectionData = rayLineIntersect(ray, o, a, segmentLength)
        }}
        //let segmentLength = 2*Math.sin(Math.asin(height/2/curvature)) //all segments have equal lenght

        
    }
    else if(curvature>0){


    }

        //if(intersectionData.dist > 1e-6 && intersectionData.dist < closestIntersectionData.dist) {
            closestIntersectionData = intersectionData;
        //}
    return closestIntersectionData;
}

export function rayPrismIntesect(ray, origin, angle, orthogonalDistance, sides) {
    let closestIntersectionData = {dist: Infinity}
    let segmentLength = Math.tan(2*Math.PI/sides/2)*2*orthogonalDistance;
    for(let i = 0; i < sides; i++) {
        let a = i*2*Math.PI/sides;
        let o = add(origin, mult(unitVecFromAngle(a + angle), orthogonalDistance))
        let intersectionData = rayLineIntersect(ray, o, a + angle,  segmentLength)
        if(intersectionData.dist > 1e-6 && intersectionData.dist < closestIntersectionData.dist) {
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

    //Normal flat mirror (not very intuitive, but usefull)
    if (focal == 0 && oneSided) {
        let angleOut = Math.PI - angleIn
        let r = rotate(normal, angleOut)
        return {p, r}
    }
            
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
    
    let angleOut;

    if (cross > 0) {
        angleOut = Math.asin(1.0/n*Math.sin(angleIn))
    } else if (Math.abs(angleIn) <= Math.asin(1.0/n)) {
        angleOut = Math.asin(n*Math.sin(angleIn))
    } else {
        angleOut = Math.PI - angleIn;
    }

    let r = rotate(normal, angleOut)
    let p = add(intersectionData.ray.p, mult(intersectionData.ray.r, intersectionData.dist));
    return {p, r}
}
//export function snellRefractionN(intersectionData, n1, n2) {
  //  let cross = crossSign(intersectionData.segment, intersectionData.ray.r)
    //let normal = norm(rotate(intersectionData.segment, cross*Math.PI/2))
    //let angleIn = angleBetween(intersectionData.ray.r, normal);
   // let angleOut;
   // if (cross > 0) {
   //     angleOut = Math.asin(n1/n2*Math.sin(angleIn))
    //} else if (Math.abs(angleIn) <= Math.asin(n1/n2)) {
     //   angleOut = Math.asin(n1*Math.sin(angleIn)/n2)
    //} else {
      //  angleOut = Math.PI - angleIn;
    //}
//
  //  return  {p, r}
//}

