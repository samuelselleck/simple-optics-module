<script>
    import { createEventDispatcher } from 'svelte';
    import { definitions } from '../../model/definitions.js'

    let items = [...definitions.keys()]

    const dispatch = createEventDispatcher();

    function creatingOpticsObject(type) {
        dispatch("creating", {type})
    }
</script>


<div class="container">
    {#each items as type}
        <button on:click={() => creatingOpticsObject(type)}>{type}</button>
    {/each}
</div>

<style>
    .container {
        pointer-events: none;
        height: 100%;
        width: min-content;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        flex-direction: column;
    }
</style>