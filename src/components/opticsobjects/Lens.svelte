<script>
    import OpticsObject from "./OpticsObject.svelte";
    import TranslationAnchor from '../anchors/TranslationAnchor.svelte'
    import RotationAnchor from '../anchors/RotationAnchor.svelte'


    export let properties;

    $: path = () => {

        let h = properties.height
        let r = properties.focal*2

        if(r > 0) { //Convex
            r = Math.max(r, h)
            return`
                M0,${h/2}
                a${r},${r} 0 0,0 0,-${h}
                a${r},${r} 0 0,0 0,${h}`

        } else { //Concave
            r = Math.max(-r, h);
            let d = r - Math.sqrt(r*r - h*h/4) + h/20
            return`
                M${-d},${h/2} 
                a${r},${r} 0 0,0 0,-${h}
                h${2*d}
                a${r},${r} 0 0,0 0,${h}
                z`
        }
    }

    function forwardEvalFocal(v) {
        return v > 0 ? Math.max(v, 20) : Math.min(v, -20)
    }

</script>

<OpticsObject {properties}>
    <svelte:fragment slot="object">
        <path d={path()} fill="url(#glass)"/>
        <line class="refraction-line" x1="0" y1={properties.height/2} x2="0" y2={-properties.height/2}/>
    </svelte:fragment>
    <svelte:fragment slot="local">
        <!--Focal Length-->
        <TranslationAnchor bind:property={properties.focal} dir={{x: 1, y: 0}} forwardEvalOverride={forwardEvalFocal}/>
        <TranslationAnchor bind:property={properties.focal} dir={{x: -1, y: 0}} forwardEvalOverride={forwardEvalFocal}/>
        <!--Height-->
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: 1}} scale=0.5/>
        <TranslationAnchor bind:property={properties.height} dir={{x: 0, y: -1}} scale=0.5/>
    </svelte:fragment>
    <svelte:fragment slot="global">
        <RotationAnchor bind:property={properties.angle} distance={properties.height/2 + 30}/>
        <RotationAnchor bind:property={properties.angle} start={Math.PI} distance={properties.height/2 + 30}/>
    </svelte:fragment>
</OpticsObject>

<style>
    .refraction-line {
        stroke:cadetblue;
        stroke-width: 2;
    }
</style>