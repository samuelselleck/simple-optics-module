<script>
    import { createEventDispatcher } from 'svelte';

    export let types = ["beam", "lens", "mirror"]

    const dispatch = createEventDispatcher();

    function creatingOpticsObject(type) {
        console.log(type)
        dispatch("creating", {type})
    }
</script>


<div>
    {#each types as type}
        <button on:click={creatingOpticsObject(type)}>{type}</button>
    {/each}
</div>

<style>
    div {
        background: darkslategray;
        width: 10em;
        height: 3em;
        pointer-events: visible;
    }
</style>