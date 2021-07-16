<script>
    import { svgCanvas, zoomgroup, toLocalCoords } from '../stores.js';
    import GlobalSVG from '../components/GlobalSVG.svelte';
    import RayLayer from '../components/RayLayer.svelte';
    import ObjectCreationMenu from '../components/html-controls/ObjectCreationMenu.svelte';
    import PropertiesDisplay from '../components/html-controls/PropertiesDisplay.svelte';
    import { definitions } from '../model/definitions.js'
    import { selectedApparatus, snapToCenterline } from '../stores.js'
    import panzoom from 'panzoom';
    import { onMount } from 'svelte';

    let apparatus = []

    function createObject(event) {
        let pos = $toLocalCoords($zoomgroup, {x: window.innerWidth/2, y: window.innerHeight/2})
        console.log(pos)
        apparatus = [...apparatus, definitions.get(event.detail.type).build(pos)]
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

    onMount(() => {
        panzoom($zoomgroup, {
            maxZoom: 2,
            minZoom: 0.5,
        });
    })
</script>

<div class="fill">

    <!--SVG Layer-->
    <svg class="canvas fill" viewBox="0 -540 1900 1000" bind:this={$svgCanvas} xmlns="http://www.w3.org/2000/svg">
        <g bind:this={$zoomgroup}>
            <GlobalSVG/>
            {#if $snapToCenterline}
                <line class="center-line" x1="-10000000" y1="0" x2="10000000" y2="0"/>
            {/if}
            <RayLayer {apparatus}/>
            {#each apparatus as o}
                <svelte:component this={definitions.get(o.type).component} properties={o.properties}/>
            {/each}
        </g>
    </svg>

    <!--HTML Controls Layer-->
    <div class="ui-layer">
        <div class="sidebar">
            <ObjectCreationMenu on:creating={createObject}/>
            <button on:click={deleteSelected}> Del </button>
        </div>
        <div class="bottom">
            <PropertiesDisplay bind:properties={selected}/>
            <label class="right">
                Snap Objects To Center
                <input type="checkbox" bind:checked={$snapToCenterline}/>
            </label>
        </div>
    </div>
</div>

<style>
    .ui-layer {
        position: relative;
        z-index: 100;
        height: 100%;
        width: 100%;
        pointer-events: none;
        color: white;
    }
    .canvas {
        background: black;
    }

    .sidebar {
        width: fit-content;
        pointer-events: all;
    }

    .right {
        margin-left: auto
    }
    .bottom {
        align-items:  right;
        background: var(--main-gray);
        display: flex;
        justify-content: space-between;
        width:100%;
        text-align: right;
        pointer-events: all;
        position: absolute;
        bottom: 0;
    }


    .center-line {
        stroke: white;
        stroke-width: 1;
        stroke-dasharray: 5, 15;
        opacity: 0.2;
    }
</style>