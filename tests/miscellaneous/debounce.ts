export function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeout: number, context: any, args: any;
  return function (this: any) {
    context = this;
    args = arguments;
    const later = function () {
      timeout = 0;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = <any>setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}
