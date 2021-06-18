<script>
    import { svgCanvas } from '../stores.js';
    import Lens from '../components/opticsobjects/Lens.svelte';
    import Beam from '../components/opticsobjects/Beam.svelte';
    import Mirror from '../components/opticsobjects/Mirror.svelte';
    import GlobalSVG from '../components/GlobalSVG.svelte';
    import RayLayer from '../components/RayLayer.svelte';
    import ObjectCreationMenu from '../components/html-controls/ObjectCreationMenu.svelte';

    let typeDict = {
        "lens": Lens,
        "beam": Beam,
        "mirror": Mirror,
    }

    let opticsObjects = []
    let lights = []

    let mousePos = {x: 0, y: 0}

    function moved(event) {
        mousePos.x = event.clientX;
        mousePos.y = event.clientY;
    }

    function createObject(event) {
        console.log(event.detail.type)
        switch(event.detail.type) {
            case 'lens':
                opticsObjects = [...opticsObjects, 
                    {
                        type: "lens",
                        properties: {pos: {x: 200, y: 200}, height: 300, focal: 500, angle: 0}
                    }
                ]
            break;
            case 'mirror':
                opticsObjects = [...opticsObjects, 
                    {
                        type: "mirror",
                        properties: {pos: {x: 200, y: 200}, height: 400, angle: 0}
                    }
                ]
            break;
            case 'beam':
                lights = [...lights, 
                    {
                        type: "beam",
                        properties: {pos: {x: 200, y: 200}, height: 250, angle: 0}
                    }
                ]
            break;
            default: console.log(event.detail.type)
        }
    }

</script>

<svelte:window on:pointermove={moved}/>

<div class="fill">
    <svg class="canvas fill" bind:this={$svgCanvas} xmlns="http://www.w3.org/2000/svg">
        <GlobalSVG/>

        {#each [...lights, ...opticsObjects] as obj}
            <svelte:component this={typeDict[obj.type]} properties={obj.properties}/>
        {/each}

        <RayLayer {lights} {opticsObjects}/>
    </svg>
    <div class="ui">
        <ObjectCreationMenu on:creating={createObject}/>
    </div>
</div>

<style>
    .canvas {
        background: black;
    }

    .ui {
        position: absolute;
        background: blue;
        color: white;
        pointer-events: none;
    }
</style>