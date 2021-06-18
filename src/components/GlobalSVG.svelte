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
</style>