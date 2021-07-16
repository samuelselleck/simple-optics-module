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
    {#each Object.keys(properties) as property}
        {#if !hidden.includes(property)}
            <span>{property}:</span> 
            {#if properties[property] && properties[property].hasOwnProperty('x') && properties[property].hasOwnProperty('y')}
                <input type=number bind:value={properties[property].x}/>
                <input type=number bind:value={properties[property].y}/>
            {:else}
                <input type=number bind:value={properties[property]}/>
            {/if}
        {/if}
    {/each}
</div>
{/if}

<!--Very inneficient to use this everywhere to detect updates, but works for now-->
<svelte:window on:pointermove={update}/>

<style>

    input {
        background-color: black;
        width: 5em;
        border: none;
        color: white;
        margin: 5px;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    }
</style>
