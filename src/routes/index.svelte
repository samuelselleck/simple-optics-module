<script context="module">
    export async function load({ page, fetch, session, context }) {
        const encodedApparatus = page.query.get("apparatus") ?? encodeURI(JSON.stringify([]));
        return {props: {encodedApparatus, baseURL: page.host}}
    }
</script>


<script>
    import { svgCanvas, zoomgroup, toLocalCoords } from '../stores.js';
    import GlobalSVG from '../components/GlobalSVG.svelte';
    import RayLayer from '../components/RayLayer.svelte';
    import ObjectCreationMenu from '../components/html-controls/ObjectCreationMenu.svelte';
    import PropertiesDisplay from '../components/html-controls/PropertiesDisplay.svelte';
    import { definitions } from '../model/definitions.js'
    import { selectedApparatus, snapToCenterline, scale } from '../stores.js'
    import Panzoom from '@panzoom/panzoom';
    import { onMount } from 'svelte';
    import { saveAs } from 'file-saver';

    export let baseURL;
    export let encodedApparatus;

    let apparatus = parseApparatus(encodedApparatus)
    let panzoom;
    let edge = 100000;
    
    let mousePos = {x: 0, y: 0}

    function createObject(event) {
        let pos = $toLocalCoords($zoomgroup, {x: window.innerWidth/2, y: window.innerHeight/2})
        let new_apparatus =  definitions.get(event.detail.type).build(pos)
        new_apparatus.properties.id = apparatus.length;
        apparatus = [...apparatus, new_apparatus]
        $selectedApparatus = new_apparatus.properties.id;
    }

    function deleteSelected() {
        apparatus = apparatus.filter(o => o.properties.id != $selectedApparatus)
        $selectedApparatus = null;
    }

    function clear() {
        let clear = confirm("Are you sure you want to clear the workspace?");
        if (clear) {
            apparatus = []
            $selectedApparatus = null
        }
    }

    function copySelected() {
        let selected = apparatus.filter(o => o.properties.id == $selectedApparatus)[0]
        if (selected) {
            let copy = definitions.get(selected.type).copy(selected.properties)
            copy.properties.pos.x += 10;
            copy.properties.pos.y += 10;
            copy.properties.id = apparatus.length;
            apparatus = [...apparatus, copy]
        }
    }

    function save() {
        let json = encodeURI(JSON.stringify(apparatus, null, 0))
        let url = baseURL + "?apparatus=" + json;

        //Chrome
        if (navigator.clipboard != undefined) {
            navigator.clipboard.writeText(url).then(function () {
                alert("Copied Workspace URL to Clipboard")
            }, function (err) {
                alert("Workspace link: " + url)
            });
        }
        // Internet Explorer
        else if(window.clipboardData) { 
            window.clipboardData.setData("Text", url);
        }
    }

    function parseApparatus(e) {
       return JSON.parse(decodeURI(e))
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
            minScale: 0.1,
            startY: window.innerHeight/2
        });
    })

    function keydown(e) {
        if (e.key == "Delete") {
            deleteSelected()
        }
    }


    function moved(e) {
        mousePos = $toLocalCoords($zoomgroup, {x: e.clientX, y: e.clientY})
    }

    function zoomchanged(event) {
        $scale = event.detail.scale
    }
</script>

<svelte:window on:pointermove={moved} on:keydown={keydown}/>

<!--SVG Layer-->
<svg class="fill canvas" on:mousewheel={panzoom.zoomWithWheel} bind:this={$svgCanvas} xmlns="http://www.w3.org/2000/svg">
    <g bind:this={$zoomgroup} on:panzoomchange={zoomchanged}>
        <GlobalSVG {edge} snap={$snapToCenterline}/>    
        <RayLayer {apparatus}/>
        {#each apparatus as o (o.properties.id)}
            <svelte:component this={definitions.get(o.type).component} properties={o.properties}/>
        {/each}
    </g>
</svg>

<!--HTML Controls Layer-->
<div class="fill ui-layer">

    <div class="left ui">
        <div class="btngroup">
            <ObjectCreationMenu on:creating={createObject}/>
        </div>
        <div class="btngroup">
            <button on:click={deleteSelected}> Del </button>
            <button on:click={copySelected}> Copy </button>
        </div>
        <div class="btngroup">
            <button on:click={clear}> Clear </button>
        </div>
    </div>

    <div class="right">
        x: {parseInt(mousePos.x)}, y: {parseInt(mousePos.y)}
    </div>

    <div class="bottom ui">
        <PropertiesDisplay bind:properties={selected}/>
        <div>
            <!--<label class="right">
                Center
                <input type="checkbox" bind:checked={$snapToCenterline}/>
            </label>-->
            <button width on:click={save}> Copy to Clipboard </button>
        </div>
    </div>

</div>

<style>

    .ui-layer {
        z-index: 1;
        pointer-events: none;
        color: white;
    }

    .canvas {
        background: black;
    }

    .ui {
        pointer-events: all;
    }

    .left {
        float: left;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        max-height: 90%;
    }

    .btngroup {
        margin-bottom: 10px;
        display: inline-flex;
        flex-direction: column;
        flex-wrap: wrap;
    }

    .right {
        float:right;
    }

    .bottom {
        pointer-events: all;
        background: var(--main-gray);
        width:100%;
        min-height: 2em;
        position: fixed;
        bottom: 0;

        display: flex;
        flex-direction: row;
        justify-content:space-between;
        flex-wrap: wrap;
    }
</style>