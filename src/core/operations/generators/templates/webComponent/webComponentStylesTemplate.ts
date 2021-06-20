import { Template } from '../template';

export const WebComponentStylesTemplate: Template = () => {
  return `export const styles = /*html*/ \`<style>
  .container {
    display: block;
  }
</style>\`;
`;
};
