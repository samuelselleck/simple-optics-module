<script>
    import { svgCanvas } from '../stores.js';
    import OpticsObject from "../components/OpticsObject.svelte";
    import GlobalSVG from "../components/GlobalSVG.svelte";
    let opticsObjects = []

    function key(event) {
        console.log(opticsObjects)
        opticsObjects = [...opticsObjects, {pos: {x: 500, y: 500}, height: 300, focal: 500, angle: 180}]
    }
</script>

<svelte:window on:keydown={key}/>

<div class="fill">
<svg class="canvas fill" bind:this={$svgCanvas} xmlns="http://www.w3.org/2000/svg">
    {#each opticsObjects as properties}
        <OpticsObject {properties}/>
	{/each}
    <GlobalSVG/>
</svg>
</div>

<style>
    .canvas {
        background: black;
    }
</style>