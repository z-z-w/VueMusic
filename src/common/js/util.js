export function shuffle(arr) {
  let list = arr.slice();
  return list.sort(function () { return Math.random() > 0.5 ? -1 : 1 });
}

export function debounce(func, delay) {   //截流函数
  let timer;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}