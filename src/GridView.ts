import Product from "./Product";

type Options = {
  wrapperClassname?: string;
};

export default class GridView {
  wrapper: HTMLDivElement;
  constructor(grid: (Product | null)[][], options: Options = {}) {
    const wrapper = document.createElement("div");
    wrapper.className = options.wrapperClassname || "grid-wrapper";
    for (let y = 0; y < grid.length; y++) {
      const row = document.createElement("ul");
      for (let x = 0; x < grid[0].length; x++) {
        const col = document.createElement("li");
        const product = grid[y][x];
        if (product) {
          for (let i = 0; i < product.quantity; i++) {
            const productEl = document.createElement("span");
            productEl.dataset.productId = product.id.toString();
            col.appendChild(productEl);
          }
        }
        row.appendChild(col);
      }
      wrapper.appendChild(row);
    }
    this.wrapper = wrapper;
  }

  removeProduct(row: number, col: number) {
    const place = this.wrapper.children[row].children[col];
    if (place.children.length) {
      place.removeChild(place.lastChild!);
    }
  }

  render(root: HTMLElement) {
    root.appendChild(this.wrapper);
  }
}
