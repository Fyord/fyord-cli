import { Template } from '../template';

export const UtilsTemplate: Template = () => {
  return `pub fn set_panic_hook() {
  #[cfg(feature = "console_error_panic_hook")]
  console_error_panic_hook::set_once();
}
`;
};
