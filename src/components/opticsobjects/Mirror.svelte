<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'


    export let properties;
    $: r = (properties.height*properties.height/4 + properties.curve*properties.curve)/properties.curve/2
    $: h = properties.height
    $: path = `M0,${h/2} a${r},${r} 0 0,${r < 0 | 0} 0,-${h}`
</script>

<OpticsObject {properties}>
    <g slot="object">
        <path class=mirror d={path}/>
    </g>
    <g slot="local">
        <!--Height-->
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: 1}} scale=0.5/>
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: -1}} scale=0.5/>
        <!--Curve-->
        <TranslationAnchor bind:property={properties.curve} dir={{x: 1, y: 0}}/>
    </g>
    <g slot="global">
        <RotationAnchor bind:property={properties.angle} distance={properties.height/2 + 30}/>
        <RotationAnchor bind:property={properties.angle} start={Math.PI} distance={properties.height/2 + 30}/>
    </g>
</OpticsObject>

<style>
    .mirror {
        stroke: white;
        stroke-width: 10;
        pointer-events: visibleStroke;
        stroke-linecap: round;
        fill: none;
    }

</style>