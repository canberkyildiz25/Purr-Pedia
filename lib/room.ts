/* A scene holds the page still for a while, and for that the window has to be
   tall enough to hold what the scene shows. Below these heights the scenes do
   not run and the page is laid out still, as it is when less motion is asked
   for.

   In rem. `split` is the width at which a scene sets its words beside its
   picture; from there on it needs `wide`, and under it, stacked, `narrow`.
   The height is the small viewport height, the one a phone has with its
   toolbars showing, so the answer does not flip as they slide away. */
export const ROOM = { split: 60, wide: 35, narrow: 40 };
