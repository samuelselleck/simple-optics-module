<script>
    import { mult, rotate, add } from '../utils/vectormath.js';

    export let opticsObjects;
    export let lights;

    let update;

    let down = () => update = true
    let up = () => update = false


    let pathString = "";

    function calculateRayPaths() {
        let path = []

        for(let i = 0; i < lights.length; i++) {
            let p = lights[i].properties
            let dir = rotate({x: 1, y: 0}, p.angle)
            let t = mult({x: dir.y, y: -dir.x}, p.height/2)
            for(let h = -1; h <= 1; h+= 0.2) {
                let point = add(mult(t, h), p.pos)
                path.push(`M ${point.x},${point.y}`)
                path.push(`l ${dir.x*500}, ${dir.y*500}`)
            }
        }

        pathString = path.join(" ");
    }
    function moved() {
        if(update) {
            calculateRayPaths()
        }
    }

</script>

<svelte:window on:keydown={calculateRayPaths} on:mousedown={down} on:mousemove={moved} on:mouseup={up}/>

<path d={pathString}/>

<style>
    path {
        fill: none;
        stroke: red;
        stroke-width: 1;
    }
</style>