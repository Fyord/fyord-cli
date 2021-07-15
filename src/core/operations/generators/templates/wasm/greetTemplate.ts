import { Template } from '../template';

export const GreetTemplate: Template = () => {
  return `use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
  fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
  alert("Hello! \nFrom wasm/rust");
}
`;
};
