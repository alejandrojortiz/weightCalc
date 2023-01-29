# WeightCalc

[alejandrojortiz.github.io/weightcalc](https://alejandrojortiz.github.io/weightcalc/)

WeightCalc is a webapp for calculating the best way to load a given amount of weight on a barbell. The result is rendered in both a 3D visualization and in text form.  
The app runs a modified version of the naive algorithm for solving the Coin Change problem. Specifically, the algorithm optimizes for an even loading of the barbell and uses heavier weight even when lighter ones might result in a lower number of total plates being used.
Local storage is used to save weight-layouts and results between browser sessions.

## Technologies used

- React
- Nextjs
- Tailwind CSS
- React-Three-Fiber and React-Three-Drei for 3D rendering
- Dexie.js for local storage management.

## Custom Assests

- weights.js is a React component used to visualize the weights within react-three-fiber