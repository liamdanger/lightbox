# GIPHY Lightbox

## Instructions

1. Run `npm install` to get dev dependencies
2. Run `npm run start` to serve the site at `localhost:5000` (or wherever
   `serve` sees fit to put it)

## How on Earth does it work?

Though this is a pretty small toy project without any outside dependencies, I
wanted to see how far I could take it in the direction of a modern UI framework.
To that end, most of the UI is built and managed by the manipulation of a global
state object, with no need to directly touch the DOM after the elements hit the
page. The data flow looks like this:

1. A rendered component makes an update to the state object when it's acted upon
2. The state object sends out an event when it's done updating
3. Other components notice that event, check if anything they care about
   changed, then re-render if something did

It's the circle of life(cycle)!

## What's missing?

With limited time and no vendor code, lots of subtleties are missing:

* DOM diffing; components re-render all their markup at once
* Queueing of state changes to prevent race conditions
* Debouncing rapid changes
* Pagination of results
* Error handling beyond the most basic of cases
