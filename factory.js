// create the grid:
const rows = 50;
const cols = 50;
const grid = _.times(rows * cols, _.constant(0));;

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

    const r = Math.floor(idx / rows);
    const c = idx % cols;
    const mod = _.uniq(_.concat(
      _.times(rows, i => r * rows + i),
      _.times(cols, i => c + i * rows)
    ));

    const func = i => 1 + (grid[idx] === 0 ? 0 : i);
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

};

// let's go!!
createGrid();
attachEvents();