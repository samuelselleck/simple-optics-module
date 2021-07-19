<script>
    import PropertyAnchor from "../anchors/PropertyAnchor.svelte";
    import { toLocalCoords, zoomgroup } from "../../stores.js"
import { toDegrees, toRadians } from "../../utils/vectormath";


    export let properties;

    let mousePos = {x: 0, y: 0}
    
    function update(e) {
        properties = properties;
        mousePos = $toLocalCoords($zoomgroup, {x: e.clientX, y: e.clientY})
    }

    const hidden = ["type", "id"]

    let format = v => v.toFixed(2)
    let setX = (property, e) => properties[property].x = parseFloat(e.target.value);
    let setY = (property, e) => properties[property].y = parseFloat(e.target.value);
    let set = (property, e) => properties[property] = parseFloat(e.target.value);
    let setDeg = (property, e) => properties[property] = toRadians(parseFloat(e.target.value));
</script>

<div>
    x: {parseInt(mousePos.x)}, y: {parseInt(mousePos.y)}
    <span class="spacer"/>
    {#if properties}
        {#each Object.keys(properties) as property}
            {#if !hidden.includes(property)}
                <span>{property}:</span> 
                {#if properties[property] && properties[property].hasOwnProperty('x') && properties[property].hasOwnProperty('y')}
                    <input type=number value={format(properties[property].x)} on:change={e =>  setX(property, e)}/>
                    <input type=number value={format(properties[property].y)} on:change={e =>  setY(property, e)}/>
                {:else if property == "angle"}
                    <input type=number value={format(toDegrees(properties[property]))} on:change={e =>  setDeg(property, e)}/>
                    <span>°</span>
                {:else}
                    <input type=number value={format(properties[property])} on:change={e =>  set(property, e)}/>
                {/if}
            {/if}
        {/each}
    {/if}
</div>

<!--Very inneficient to use this everywhere to detect updates, but works for now-->
<svelte:window on:pointermove={update}/>

<style>

    .spacer {
        padding-right: 10px;
    }

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
