<script>
    import OpticsObject from "./_components/OpticsObject.svelte";
    let opticsObjects = [{pos: {x: 500, y: 500}, height: 300, focal: 500}]

    function key(event) {
        console.log(opticsObjects)
        opticsObjects = [...opticsObjects, {pos: {x: 500, y: 500}, height: 300, focal: 500}]
    }
</script>

<div class="fill">
<svg class="canvas fill" on:mouseup={key} xmlns="http://www.w3.org/2000/svg">
    {#each opticsObjects as properties}
        <OpticsObject {properties}/>
	{/each}
</svg>
</div>

<style>
    .canvas {
        background: black;
    }
</style>