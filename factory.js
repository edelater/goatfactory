let grid;
let flat;
let patternLength;

const cache = [1, 1];

const init = (rows = 50, cols = 50, length = 5) => {
  grid = {
    rows: rows,
    cols: cols
  };

  flat = _.times(grid.rows * grid.cols, _.constant(0));;
  patternLength = length;

  const table = $('table');
  let tr;

  _.each(flat, (val, idx) => {
    if (idx % grid.rows === 0) {
      tr = $("<tr/>");
      table.append(tr);
    }
    tr.append($(`<td id='${idx}'/>`));
  });
  $('td').css({
    width: `${100 / grid.cols}%`
  });

  attachEvents();
};

const attachEvents = () => {
  $('td').on('click', (e) => {
    const idx = parseInt(e.target.id);
    const func = flat[idx] === 0 ? i => 1 : i => i + 1;
    const row = Math.floor(idx / grid.rows);
    const col = idx % grid.cols;
    const mod = _.uniq(_.concat(
      _.times(grid.cols, i => row * grid.cols + i),
      _.times(grid.rows, i => col + i * grid.rows)
    ));

    _.each(mod, (i) => {
      flat[i] = func.apply(this, [flat[i]]);

      const elm = $(`#${i}`);
      const cur = parseInt($(elm).text() || 0);

      if (cur !== flat[i]) {
        elm.addClass('yellow')
      }

      elm.text(flat[i]);
    });

    setTimeout(() => $('td').removeClass('yellow'), 100);
    highlightFibonacciRanges();
  });
};

const highlightFibonacciRanges = () => {
  const max = _.max(flat);
  ensureCache(max);

  const haystack = `-${cache.join('-')}-`;
  for (let i = 0; i < flat.length - patternLength; i++) {

    if (i % grid.cols > grid.cols - patternLength) {
      continue;
    }

    const slice = flat.slice(i, i + patternLength);
    const needle = `-${slice.join('-')}-`;
    if (haystack.indexOf(needle) > -1) {
      for (let j = i; j < i + patternLength; j++) {
        const elm = $(`#${j}`).text('');
        flat[j] = 0;
        elm.addClass('green');
      }
    }
  }
  setTimeout(() => $('td').removeClass('green'), 1000);
};


const ensureCache = (n) => {
  const max = _.max(cache);
  if (n > max) {
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
