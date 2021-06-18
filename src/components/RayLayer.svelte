<script>
    import { mult, sub, add, unitVecFromAngle, div, intersectionParameters, rotate, norm, length, crossSign, angleBetween } from '../utils/vectormath.js';
    import { lightModels, objectModels } from '../model/definitions.js'
    export let opticsObjects;
    export let lights;

    let update;

    let down = () => update = true
    let up = () => update = false


    $: opticsObjects, lights, calculateRayPaths();
    
    let pathString = "";

    function calculateRayPaths() {
        let path = []
        const maxRayBounces = 100;

        for(let i = 0; i < lights.length; i++) {
            let light = lights[i]
            let rays = lightModels.get(light.type).rays(light.properties);

            for(let r = 0; r < rays.length; r++) {
                let ray = rays[r]
                path.push(`M ${ray.p.x},${ray.p.y}`)

                let j;
                for(j = 0; j < maxRayBounces; j++) {
                    let hit = calculateHit(ray)
                    if(hit != null) {
                        ray = hit;
                        path.push(`L ${ray.p.x}, ${ray.p.y}`)
                    } else {
                        break;
                    }
                }

                if(j < maxRayBounces) {
                    path.push(`l ${ray.r.x*10000}, ${ray.r.y*10000}`)
                }
            }
        }

        pathString = path.join(" ");
    }

    function calculateHit(ray) {

        let closest = Infinity;
        let id = null;
        let segmentHit = null;

        for(let i = 0; i < opticsObjects.length; i++) {
            let o = opticsObjects[i].properties
            let segment = mult(unitVecFromAngle(o.angle + Math.PI/2), o.height)
            let origin = sub(o.pos, div(segment, 2))
            let params = intersectionParameters(ray.p, ray.r, origin, segment)

            if (params) {
                if(params.s >= 0&& params.s <= 1) {
                    if(params.t > 1e-6 && params.t < closest) {
                        closest = params.t
                        id = i;
                        segmentHit = segment;
                    }
                }
            }
        }

        if(closest < Infinity) {
            let o = opticsObjects[id]
            let pos = add(ray.p, mult(ray.r, closest));
            return objectModels.get(o.type).outRay(o.properties, pos, ray.r, segmentHit)
        } else {
            return null;
        }
    }

    function moved() {
        if(update) {
            calculateRayPaths()
        }
    }

</script>

<svelte:window on:pointerdown={down} on:pointermove={moved} on:pointerup={up}/>

<path d={pathString}/>

<style>
    path {
        fill: none;
        stroke: red;
        stroke-width: 1;
        pointer-events: none
    }
</style>