the 4 x 4
-------
suppose we have a 4 x 4 grid; every cell has an index

```
 0  1  2  3
 4  5  6  7
 8  9 10 11
12 13 14 15
```

for easy 'walking' we create a flat array with the values:

```
flat = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
```

if we click a cell, we get its row/col as follows:
suppose we click cell index 6 (row 1, col 2):

a simple division (without fraction) with the number of rows, shows us in which 
row it is: 
as in: 

```
6 / 4 = 1.5 
```
so we've had 1.5 rows, which means I'm on row index 1. just Floor the fraction
var row = Math.floor(6/4) = 1

a simple mod operation with the number of cols, shows us in which column it is. 
as in: how many times did i go to the end of a line, and how many is left then?
```
var column = 5 % 4 = 1, so it must be column 1
```  

So I clicked cell (1,2). What value does it have now? Well, we know the index 
already (it's just the id of the TD). 
```
current = flat[6]
```
Depending on this value, we want to either increment 'all the things' or set them to 1:
```
const func = flat[idx] === 0 ? i => 1 : i => i + 1;

which is just some delegate trick to write this:
var func;
if (flat[idx] === 0) {
  func = (valueOfCell) => {
    return 1;
  }
} else {
  func = (valueOfCell) => {
    return valueOfCell + 1;
  }
}
```

Now we need to get the 'to be modified cells'.
Which are 'all cells in the same row' + 'all cells in the same column'.
Careful there; our clicked cell is in both ranges; we don't want to increment him twice!

Row cells:
```
_.times(grid.cols, i => row * grid.cols + i);
```
fancy way of:
```
var mod = [];
for (var i = 0; i < grid.cols; i++) {
  var cellIndex = i + row * grid.cols;
  mod.push(cellIndex);
}
```
1. Walk from 0 to number of columns
2. Add the 'completed rows' to i (in this case we are at row 1, so we need to add 1 * 4 every time to our index)
3. Push it

This results in: `[4,5,6,7]`
Almost the same for columns:


Column cells:
```
_.times(grid.rows, i => col + i * grid.rows)
```
fancy way of:
```
var mod = [];
for (var i = 0; i < grid.rows; i++) {
  var cellIndex = i * grid.rows + col;
  mod.push(cellIndex);
}
```
1. Walk from 0 to number of rows
2. Multiply i with the number of rows to get the current row
3. Add the current col to 'jump' to the right column
4. Push it

This results in `[2,6,10,14]`

Deduplicate: with `_.uniq()` to get `[2,4,5,6,7,10,14]`

Now it is as simple as an `_.each`:
- we know which cells to modify (`mod`)
- we know what to do with them (`func`)
- just one thing: before setting the new value (based on `func`) check the current value, since we only want to highlight (yellow) on change..

Fibonacci
---------

Next up: checking for sequences of say length: 3 in the grid.
We initialize our cache with `[1,1]` since ones suck.

The idea:

1. get the highest number in the grid
2. check if the cache contains a number at least as big as this `max`
3. if it doesn't? fill the cache until at least this `max`
4. if it does? all is ready for.....

The Search:
-----------
In our flattened array, take ranges of `patternLength` size (in this case 3). For the first row these would be:
```
[0,1,2]
[1,2,3]
[2,3,4]
[3,4,5]
```
Now careful! The last two are 'wrapping around' the grid. Partly on row 0, partly on row 1
So we drop them! How? Well..
we walk from 0 to gridsize - patternlength, in our case:
```
for (var i = 0; i < 16 - 3; i++) {

}
```
Of course we stop looping when 3 positions from the end, since we cannot construct a range of 3 after that any more.
Every time our 'finger'(tm) is no longer able to construct a range of 3 on the same row we continue:
```
if (i % grid.cols > grid.cols - patternLength) {
  continue;
}
```
As in: suppose I'm at index 2, that means I'm at column `2 % 4 == 2`, which is `>` than  `(4 - 3)` so we're no longer able to get a range on the same line

Now we get all kind of ranges, how to check if there is a match? HACK!
If we concat the range-values to something like "-0-1-10-" and the cache-values to something like "-1-1-2-3-5-8-13-21-34-" we can get away with a simple `indexOf` or `contains` or whatnot 

We need some separator over here, or else we might get some false positives:
- suppose the range values are `[11,23,58]`, 
- joined: `"112358"`
- cache values joined: `"112358132134"`
And yes, the string matches, but the 3 numbers are not fibonacci numbers...

Of course the ones are at fault :-)

If there is a match, simple highlight and clear the cells (don't forget to update the `flat` array)
