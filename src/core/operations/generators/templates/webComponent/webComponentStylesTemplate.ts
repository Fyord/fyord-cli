import { Template } from '../template';

export const WebComponentSpecTemplate: Template = () => {
  return `export const styles = /*html*/ \`<style>
  .container {
    display: block;
  }
</style>\`;
`;
};
