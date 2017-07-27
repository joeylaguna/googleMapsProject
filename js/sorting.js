const merge = (left, right, type, sorted) => {
  let results = [];

  if (type === 'rating') {
    while (left.length && right.length) {
      if (sorted) {
        if (left[0].rating < right[0].rating) {
          results.push(left.shift());
        } else {
          results.push(right.shift());
        }  
      } else {
        if (left[0].rating > right[0].rating) {
          results.push(left.shift());
        } else {
          results.push(right.shift());
        }
      }  
    }
  } else if (type === 'name') {
    while (left.length && right.length) {
      if (sorted) {
        if (left[0].name < right[0].name) {
          results.push(left.shift());
        } else {
          results.push(right.shift());
        }
      } else {
        if (left[0].name > right[0].name) {
          results.push(left.shift());
        } else {
          results.push(right.shift());
        }
      }
    }
  }

  while (left.length) {
    results.push(left.shift());
  }

  while (right.length) {
    results.push(right.shift());
  }
  return results;
}

const mergeSort = (arr, type, sorted) => {
  console.log('inside file');
  if (arr.length < 2) {
    return arr;
  }

  let middle = parseInt(arr.length / 2);
  let left = arr.slice(0, middle);
  let right = arr.slice(middle, arr.length);

  return merge(mergeSort(left, type, sorted), mergeSort(right, type, sorted), type, sorted);
}