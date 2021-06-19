import { Strings } from 'tsbase';
import { ISettingsService, Settings, SettingsService } from '../../../../../settings/module';
import { Template } from '../template';

export const CustomElementTemplate: Template = (
  args?: string[],
  settingsService: ISettingsService = SettingsService.Instance()) => {
  const preferredStyleExtension = settingsService.GetSettingOrDefault(Settings.StyleExtension);

  const name = args?.[0] || Strings.Empty;
  const selector = args?.[1] || Strings.Empty;

  return `import { JsxRenderer, ParseJsx } from 'fyord';
import styles from './${Strings.CamelCase(name)}.module.${preferredStyleExtension}';

export class ${Strings.PascalCase(name)} extends HTMLElement {
  private static attributes: Record<string, string> = {};

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
    this.innerHTML = JsxRenderer.RenderJsx(<div class={styles.container}>Hello ${name} element!</div>);
  }

  disconnectedCallback(): void {
    // cleanup any resources opened by the element here
  }
}

(() => {
  if (!window.customElements.get('${selector}')) {
    window.customElements.define('${selector}', ${Strings.PascalCase(name)});
  }
})();
`;
};
