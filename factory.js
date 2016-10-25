// create the grid:
const rows = 10;
const cols = 10;
const grid = _.times(rows * cols, _.constant(0));;
const fCache = [];
window.goat = fCache;

const createGrid = () => {
  const table = $('table');
  let tr;

  _.each(grid, (val, idx) => {
    if (idx % rows === 0) {
      tr = $("<tr/>");
      table.append(tr);
    }
    tr.append($(`<td id='${idx}'/>`));
  });
};

const attachEvents = () => {
  $('td').on('click', (e) => {
    const idx = parseInt(e.target.id);
    const func = grid[idx] === 0  ? i => 1 : i => i + 1;

    const r = Math.floor(idx / rows);
    const c = idx % cols;
    const mod = _.uniq(_.concat(
      _.times(rows, i => r * rows + i),
      _.times(cols, i => c + i * rows)
    ));

    _.each(mod, (i) => {
      grid[i] = func.apply(this, [grid[i]]);
      $(`#${i}`).text(grid[i] === 0 ? '' : grid[i]).addClass('yellow');
    });

    // BOOOOOOOO
    setTimeout(() => $('td').removeClass('yellow'), 100);

    highlightFibonacciRanges();
  });
};

const highlightFibonacciRanges = () => {
  // todo:

};

const isFibo = (n) => {
  const isPerfectSquare = (x) => {
    const s = Math.sqrt(x);
    return (s * s == x);
  };

  return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
};

const getNthFibo = (n) => {
  return n <= 2 ? 1 : getNthFibo(n - 1) + getNthFibo(n - 2); 
};

// let's go!!
createGrid();
attachEvents();