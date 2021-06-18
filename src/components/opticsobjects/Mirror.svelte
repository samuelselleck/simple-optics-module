<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'


    export let properties = {pos: {x: 500, y: 500}, height: 300, angle: 0};

</script>

<OpticsObject {properties}>
    <g slot="object">
        <line class="hitbox" x1="0" y1={properties.height/2} x2="0" y2={-properties.height/2}/>
        <line class="mirror" x1="0" y1={properties.height/2} x2="0" y2={-properties.height/2}/>
    </g>
    <g slot="local">
        <!--Height-->
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: 1}} scale=0.5/>
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: -1}} scale=0.5/>
    </g>
    <g slot="global">
        <RotationAnchor bind:property={properties.angle} distance={properties.height/2 + 30}/>
        <RotationAnchor bind:property={properties.angle} start={Math.PI} distance={properties.height/2 + 30}/>
    </g>
</OpticsObject>

<style>
    .mirror {
        stroke:cadetblue;
        stroke-width: 5;
        stroke-linecap: round;
    }

    .hitbox {
        stroke: white;
        stroke-width: 10;
        pointer-events: visibleStroke;
        stroke-linecap: round;
    }

</style>