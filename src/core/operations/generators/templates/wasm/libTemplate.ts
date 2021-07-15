import { Template } from '../template';

export const LibTemplate: Template = () => {
  return `mod rust;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
`;
};
