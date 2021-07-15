import { Strings } from 'tsbase';
import { Template } from '../template';

export const WebComponentTemplate: Template = (
  args?: string[]) => {

  const name = args?.[0] || Strings.Empty;
  const selector = args?.[1] || Strings.Empty;
  const camelCaseName = Strings.CamelCase(name);

  return `import { JsxRenderer, ParseJsx } from 'fyord';
import { styles } from './${camelCaseName}.styles';

export class ${Strings.PascalCase(name)} extends HTMLElement {
  private static attributes: Record<string, string> = {};
  private dom: ShadowRoot | null = null;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
  }

  static get observedAttributes(): Array<string> { return Object.keys(this.attributes); }
  attributeChangedCallback(): void {
    this.render();
  }

  render(): void {
    this.dom = this.dom || this.attachShadow({ mode: 'open' });
    this.dom.innerHTML = styles + JsxRenderer.RenderJsx(
      <div class="container" style={'font-weight: bold;'}>Hello ${camelCaseName} component!</div>,
      this.dom);
  }

  disconnectedCallback(): void {
    // cleanup any resources opened by the component here
  }
}

(() => {
  if (!window.customElements.get('${selector}')) {
    window.customElements.define('${selector}', ${Strings.PascalCase(name)});
  }
})();
`;
};
