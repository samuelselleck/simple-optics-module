<script>
    export let edge;
    export let snap;
</script>

<pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.2"/>
</pattern>
<pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
    <rect width="100" height="100" fill="url(#smallGrid)"/>
    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="0.5"/>
</pattern>

<rect x={-edge} y={-edge} width={2*edge} height={2*edge} fill="url(#grid)" />

{#if snap}
    <line class="center-line" x1={edge} y1="0" x2={-edge} y2="0"/>
{/if}

<!--Markers-->
<symbol>
    <circle id="anchor-marker" cx="0" cy="0" r="8" />
</symbol>

<symbol>
    <path id="rotation-marker" d="m-.499-18.028 8.749-6.126-23.974-4.227-4.232 23.978 8.857-6.202c10.382 17.495 11.131 36.974 2.19 48.098 2.058-.701 4.018-1.678 5.837-2.952 13.703-9.595 14.546-32.408 2.575-52.57z"/>
</symbol>

<!--Materials-->
<defs>
    <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:white;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:white;stop-opacity:0.3" />
    </linearGradient>
    <linearGradient id="mirror" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:gray;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#CCCCDD;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="metal">
        <stop offset="0%" stop-color="#2e2b30"></stop>
        <stop offset="100%" stop-color="#1d1c1f"></stop>
    </linearGradient>
</defs>

<style>
    #anchor-marker {
        fill: rgba(255, 255, 255, 0.01);
        stroke: white;
        stroke-width: 2;
    }

    #rotation-marker {
        fill: rgba(255, 255, 255, 0.5);
    }

    .center-line {
        stroke: white;
        stroke-width: 1;
        stroke-dasharray: 5, 15;
        opacity: 1;
    }
</style>