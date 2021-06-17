<script>
    export let opticsObjects;
    export let lights;

    let update;

    let down = () => update = true
    let up = () => update = false


    let path = "";

    function calculateRayPaths() {
        path = ""

        for(let i = 0; i < lights.length; i++) {
            let p = lights[i].properties
            path += `M ${p.pos.x},${p.pos.y} `
            let a = p.angle*Math.PI/180;
            path += `l ${500*Math.cos(a)},${500*Math.sin(a)}`
        }
    }
    function moved() {
        if(update) {
            calculateRayPaths()
        }
    }

</script>

<svelte:window on:keydown={calculateRayPaths} on:mousedown={down} on:mousemove={moved} on:mouseup={up}/>

<path d={path}/>

<style>
    path {
        fill: none;
        stroke: red;
        stroke-width: 1;
    }
</style>