<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'
    
    export let properties = {pos: {x: 500, y: 500}, angle: 180, height: 300};

</script>

<OpticsObject {properties}>
    <g slot="object">
        <rect width={properties.height/4} height={properties.height} x={-properties.height/4} y={-properties.height/2}/>
    </g>
    <g slot="local">
        <!--Height-->
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: 1}} scale=0.5/>
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: -1}} scale=0.5/>
    </g>
    <g slot="global">
        <!--Rotation-->
        <RotationAnchor bind:property={properties.angle} start=180 distance={properties.height/4 + 30}/>
    </g>
</OpticsObject>

<style>
    rect {
        fill: url(#metal)
    }
</style>