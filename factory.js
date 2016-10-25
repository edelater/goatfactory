// the grid
const grid = {
  rows: 20,
  cols: 20
};

// flattened grid
const flat = _.times(grid.rows * grid.cols, _.constant(0));;

// fibonacci
const cache = [1, 1];
const patternLength = 5;

// create grid/table
const createGrid = () => {
  const table = $('table');
  let tr;

  _.each(flat, (val, idx) => {
    if (idx % grid.rows === 0) {
      tr = $("<tr/>");
      table.append(tr);
    }
    tr.append($(`<td id='${idx}'/>`));
  });
};

// handle click
const attachEvents = () => {
  $('td').on('click', (e) => {
    const idx = parseInt(e.target.id);

    // if current value === 0, return 1, else current + 1;
    const func = flat[idx] === 0 ? i => 1 : i => i + 1;

    // get row and column from index:
    const row = Math.floor(idx / grid.rows);
    const col = idx % grid.cols;

    // _.uniq, because the clicked cell is in both ranges:
    const mod = _.uniq(_.concat(
      _.times(grid.rows, i => row * grid.rows + i), // row values
      _.times(grid.cols, i => col + i * grid.rows)  // col values
    ));

    // handle modified cells:
    _.each(mod, (i) => {
      // spank goat
      flat[i] = func.apply(this, [flat[i]]);

      const elm = $(`#${i}`);
      const cur = parseInt($(elm).text() || 0); // text may be emtpy :-(

      // only highlight changed items:
      if (cur !== flat[i]) {
        elm.addClass('yellow')
      }

      elm.text(flat[i]);
    });

    setTimeout(() => $('td').removeClass('yellow'), 100);
    highlightFibonacciRanges();
  });
};

// we are going to search for ranges of xx length
// look for -2-3-5-8-13- in the 'modified' cache 
// which looks like: 
// -1-1-2-3-5-8-13-21-34-55-89-
const highlightFibonacciRanges = () => {
  const max = _.max(flat);
  ensureCache(max);

  // take strips of patternLength pieces, and check if they match:
  const haystack = `-${cache.join('-')}-`;
  for (let i = 0; i < flat.length - patternLength; i++) {

    // no wrapping around (as in: last 3 cells of row 1, first 2 cells of row 2)
    if (i % grid.cols > grid.cols - patternLength) {
      i += 5;
      continue;
    }

    // look for normal horizontal range
    const needle = `-${flat.slice(i, i + 5).join('-')}-`;
    // look for reversed ranges?
    const reversed = `-${flat.slice(i, i + 5).reverse().join('-')}-`;

    // TODO: look for vertical range
    // TODO: look for diagonal range

    const found = haystack.indexOf(needle) > -1 || haystack.indexOf(reversed) > -1;
    if (found) {
      // fuck yeah!
      for (let j = i; j < i + patternLength; j++) {
        // clear text:
        const elm = $(`#${j}`).text('');
        // clear 'matrix':
        flat[j] = 0;
        // herd goats:
        elm.addClass('green');
      }
    }
  }
  // pff 
  setTimeout(() => $('td').removeClass('green'), 1000);
};


const ensureCache = (n) => {
  const max = _.max(cache);
  if (n > max) {
    // fill cache until at least a number bigger than n is in it:
    const idx = max === 1 ? 2 : cache.indexOf(max);
    let prev = cache[idx - 1];
    let res = max;
    while (res < n) {
      res = prev + max;
      prev = res;
      cache.push(res);
    }
  }
};

// let's go!!
createGrid();
attachEvents();