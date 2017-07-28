# GIPHY Lightbox

## How on Earth does it work?

Though this is a pretty small toy project without any outside dependencies, I
wanted to see how far I could take it in the direction of a modern UI framework.
To that end, most of the UI is built and managed by the manipulation of a global
state object. The workflow is basically...

1. A rendered component makes an update to the state object when it's acted upon
2. The state object sends out an event when it's done updating
3. Other components notice that event, check if anything they care about
   changed, then re-render if something did

It's the circle of life(cycle)! With limited time and no vendor code, lots of
subtleties are missing:

* DOM diffing; components re-render all at once
* Queueing of state changes
* Debouncing rapid changes
