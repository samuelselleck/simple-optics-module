<script>
import PropertyAnchor from "../anchors/PropertyAnchor.svelte";

    export let properties;

    function update() {
        properties = properties;
    }
    const hidden = ["type", "id"]
</script>

{#if properties}
<div>
    {#key properties}
        {#each Object.keys(properties) as property}
            {#if !hidden.includes(property)}
                <span>{property}:</span> 
                {#if properties[property].hasOwnProperty('x') && properties[property].hasOwnProperty('x')}
                    <input value={properties[property].x} disabled>
                    <input value={properties[property].y} disabled>
                {:else}
                    <input value={properties[property]} disabled>
                {/if}
            {/if}
        {/each}
    {/key}
</div>
{/if}

<!--Very inneficient to use this everywhere to detect updates, but works for now-->
<svelte:window on:pointermove={update}/>

<style>
    div {
        position: absolute;
        bottom: 0;
        left: 0;
        color: white;
    }

    input {
        background-color: var(--main-gray);
        width: 3em;
        border: none;
        color: white;
        margin: 5px;
    }
</style>
