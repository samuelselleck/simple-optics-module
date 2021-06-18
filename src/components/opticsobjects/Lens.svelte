<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'
    export let properties = {pos: {x: 500, y: 500}, height: 300, focal: 500, angle: 0};

    $: lensRadius = properties.focal*2
    $: path = `
        M0,${properties.height/2}
        a${lensRadius},${lensRadius} 0 0,0 0,-${properties.height}
        a${lensRadius},${lensRadius} 0 0,0 0,${properties.height}
    `
</script>

<OpticsObject {properties}>
    <g slot="object">
        <path d={path} fill="url(#glass)"/>
        <line class="refraction-line" x1="0" y1={properties.height/2} x2="0" y2={-properties.height/2}/>
    </g>
    <g slot="local">
        <!--Focal Length-->
        <TranslationAnchor bind:property={properties.focal} dir={{x: 1, y: 0}}/>
        <TranslationAnchor bind:property={properties.focal} dir={{x: -1, y: 0}}/>
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
    .refraction-line {
        stroke:cadetblue;
        stroke-width: 2;
    }
</style>