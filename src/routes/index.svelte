<script>
    import { svgCanvas } from '../stores.js';
    import GlobalSVG from '../components/GlobalSVG.svelte';
    import RayLayer from '../components/RayLayer.svelte';
    import ObjectCreationMenu from '../components/html-controls/ObjectCreationMenu.svelte';
    import { definitions } from '../model/definitions.js'
import { get } from 'svelte/store';

    let apparatus = []

    let mousePos = {x: 0, y: 0}

    function moved(event) {
        mousePos.x = event.clientX;
        mousePos.y = event.clientY;
    }

    function createObject(event) {
        apparatus = [...apparatus, definitions.get(event.detail.type).build({x: 200, y: 200})]
        console.log(apparatus)
    }

</script>

<svelte:window on:pointermove={moved}/>

<div class="fill">

    <!--SVG Layer-->
    <svg class="canvas fill" bind:this={$svgCanvas} xmlns="http://www.w3.org/2000/svg">
        <GlobalSVG/>
        {#each apparatus as o}
            <svelte:component this={definitions.get(o.type).component} properties={o.properties}/>
        {/each}
        <RayLayer {apparatus}/>
    </svg>

    <!--HTML Controls Layer-->
    <div class="ui">
        <ObjectCreationMenu items={Object.keys(definitions)} on:creating={createObject}/>
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