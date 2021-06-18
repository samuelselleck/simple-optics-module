<script>
    import { createEventDispatcher } from 'svelte';
    import { definitions } from '../../model/definitions.js'

    let items = [...definitions.keys()]

    const dispatch = createEventDispatcher();

    function creatingOpticsObject(type) {
        dispatch("creating", {type})
    }
</script>


<div>
    {#each items as type}
        <button on:click={() => creatingOpticsObject(type)}>{type}</button>
    {/each}
</div>

<style>
</style>