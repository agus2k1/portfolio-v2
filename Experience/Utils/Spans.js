export default function (element) {
  element.style.display = 'none';
  element.innerHtml = element.innerHTML
    .split('')
    .map((char) => {
      return `<span class="animated"></span>`;
    })
    .join('');

  return element;
}
