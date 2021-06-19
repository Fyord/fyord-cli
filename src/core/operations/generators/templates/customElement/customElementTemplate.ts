import { Strings } from 'tsbase';
import { ISettingsService, Settings, SettingsService } from '../../../../../settings/module';
import { Template } from '../template';

export const CustomElementTemplate: Template = (
  args?: string[],
  settingsService: ISettingsService = SettingsService.Instance()) => {
  const preferredStyleExtension = settingsService.GetSettingOrDefault(Settings.StyleExtension);

  const name = args?.[0] || Strings.Empty;
  const selector = args?.[1] || Strings.Empty;

  return `import styles from './${Strings.CamelCase(name)}.module.${preferredStyleExtension}';

export class ${Strings.PascalCase(name)} extends HTMLElement {
  private static attributes = {};

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() { return Object.keys(this.attributes); }
  attributeChangedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = /*html*/ \`<div class="\${styles.container}"></div>\`;

    try {
      // bind events handlers / do other post render stuff here
    } catch (error) {
      console.log(error);
    }
  }
}

(() => {
  if (!window.customElements.get('${selector}')) {
    window.customElements.define('${selector}', ${Strings.PascalCase(name)});
  }
})();
`;
};
