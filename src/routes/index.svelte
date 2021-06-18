<script>
    import { svgCanvas } from '../stores.js';
    import Lens from "../components/opticsobjects/Lens.svelte";
    import Beam from "../components/opticsobjects/Beam.svelte";
    import GlobalSVG from "../components/GlobalSVG.svelte";
    import RayLayer from "../components/RayLayer.svelte";

    let opticsObjects = []
    let lights = []

    let mousePos = {x: 0, y: 0}

    function moved(event) {
        mousePos.x = event.clientX;
        mousePos.y = event.clientY;
    }

    function key(event) {
        switch(event.key.toUpperCase()) {
            case 'L':
                opticsObjects = [...opticsObjects, 
                    {
                        type: Lens,
                        properties: {pos: {x: mousePos.x, y: mousePos.y}, height: 300, focal: 500, angle: 0}
                    }
                ]
            break;
            case 'B':
                lights = [...lights, 
                    {
                        type: Beam,
                        properties: {pos: {x: mousePos.x, y: mousePos.y}, height: 250, angle: 0}
                    }
                ]
            break;
            //default: console.log(event.key)
        }
    }

</script>

<svelte:window on:mousemove={moved} on:keydown={key}/>

<div class="fill">
    <div class="ui">
        <h1 class="ui-element"> </h1>
    </div>
    <svg class="canvas fill" bind:this={$svgCanvas} xmlns="http://www.w3.org/2000/svg">
        <GlobalSVG/>

        {#each [...opticsObjects, ...lights] as obj}
            <svelte:component this={obj.type} properties={obj.properties}/>
        {/each}

        <RayLayer {lights} {opticsObjects}/>
    </svg>
</div>

<style>
    .canvas {
        background: black;
        z-index: -1;
    }

    .ui {
        pointer-events: none;
        z-index: 1;
        color: white;
    }

    .ui-element {
        pointer-events: visible;
    }
</style>