<script>
    import { svgCanvas, zoomgroup, toLocalCoords } from '../stores.js';
    import GlobalSVG from '../components/GlobalSVG.svelte';
    import RayLayer from '../components/RayLayer.svelte';
    import ObjectCreationMenu from '../components/html-controls/ObjectCreationMenu.svelte';
    import PropertiesDisplay from '../components/html-controls/PropertiesDisplay.svelte';
    import { definitions } from '../model/definitions.js'
    import { selectedApparatus, snapToCenterline } from '../stores.js'
    import Panzoom from '@panzoom/panzoom';
    import { onMount } from 'svelte';

    let apparatus = []
    let panzoom;
    let edge = 100000;

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
        panzoom = Panzoom($zoomgroup, {
            cursor: "default",
            canvas: true,
            maxScale: 2,
            minScale: 0.5,
            startY: window.innerHeight/2
        });
    })

    function zoom(event) {
        panzoom.zoomWithWheel(event, {
            //focal: pos,
        })
    }

    function keydown(e) {
        if (e.key == "Delete") {
            deleteSelected()
        }
    }
</script>

<svelte:window on:keydown={keydown}/>

<div class="fill">

    <!--SVG Layer-->
    <svg class="canvas fill"  on:mousewheel={zoom} bind:this={$svgCanvas} xmlns="http://www.w3.org/2000/svg">
        <g class="grid" bind:this={$zoomgroup}>
            <GlobalSVG {edge} snap={$snapToCenterline}/>    
            <RayLayer {apparatus}/>
            {#each apparatus as o (o.properties.id)}
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

    .grid {
        background-size: 40px 40px;
        background-image:
            linear-gradient(to right, grey 1px, transparent 1px),
            linear-gradient(to bottom, grey 1px, transparent 1px);
    }

    .sidebar {
        float: left;
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
</style>