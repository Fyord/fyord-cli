export const RustTsTemplate = `import type * as RustModule from '../../pkg/rust';

export const RustWindowKey = 'rust';
export const Rust = (): typeof RustModule | undefined => {
  return window[RustWindowKey];
};
`;
