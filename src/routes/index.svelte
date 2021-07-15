<script>
    import { svgCanvas } from '../stores.js';
    import GlobalSVG from '../components/GlobalSVG.svelte';
    import RayLayer from '../components/RayLayer.svelte';
    import ObjectCreationMenu from '../components/html-controls/ObjectCreationMenu.svelte';
    import PropertiesDisplay from '../components/html-controls/PropertiesDisplay.svelte';
    import { definitions } from '../model/definitions.js'
    import { selectedApparatus, snapToCenterline } from '../stores.js'

    let apparatus = []

    let mousePos = {x: 0, y: 0}

    function moved(event) {
        mousePos.x = event.clientX;
        mousePos.y = event.clientY;
    }

    function createObject(event) {
        apparatus = [...apparatus, definitions.get(event.detail.type).build({x: 200, y: 200})]
    }

    function deleteSelected() {
        apparatus = apparatus.filter(o => o.properties.id != $selectedApparatus)
        $selectedApparatus = null;
    }

    $: selected = (() => {
        let arr = apparatus.filter(o => o.properties.id == $selectedApparatus)
        if(arr.length  > 0) {
            return arr[0].properties
        } else {
            return null;
        }
    })()
</script>

<svelte:window on:pointermove={moved}/>

<div class="fill">

    <!--SVG Layer-->
    <svg class="canvas fill" viewBox="0 -540 1900 1000" bind:this={$svgCanvas} xmlns="http://www.w3.org/2000/svg">
        <GlobalSVG/>
        {#if $snapToCenterline}
            <line class="center-line" x1="0" y1="0" x2="1900" y2="0"/>
        {/if}
        <RayLayer {apparatus}/>
        {#each apparatus as o}
            <svelte:component this={definitions.get(o.type).component} properties={o.properties}/>
        {/each}
    </svg>

    <!--HTML Controls Layer-->
    <div class="container">
        <ObjectCreationMenu on:creating={createObject}/>
        <button class="ui" on:click={deleteSelected}> Del </button>
    </div>
    <PropertiesDisplay bind:properties={selected}/>
    <div class="options">
        <label>
            <input type="checkbox" bind:checked={$snapToCenterline}/>
            Snap Objects To Center
        </label>
    </div>
</div>

<style>
    .canvas {
        background: black;
    }

    .container {
        position: absolute;
        color: white;
        pointer-events: none;
    }

    .ui {
        pointer-events: all;
        height: 2em;
    }

    .options {
        position:absolute;
        color: white;
        bottom: 0;
        right: 0;
    }

    .center-line {
        stroke: white;
        stroke-width: 1;
        stroke-dasharray: 5, 15;
        opacity: 0.2;
    }
</style>