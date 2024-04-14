export const CargoTomlTemplate = `[package]
edition = "2018"
name = "rust"
version = "0.1.0"

[lib]
crate-type = ["cdylib", "rlib"]

[features]
default = ["console_error_panic_hook"]

[dependencies]
wasm-bindgen = "0.2.92"

console_error_panic_hook = {version = "0.1.7", optional = true}

wee_alloc = {version = "0.4.5", optional = true}

[dev-dependencies]
wasm-bindgen-test = "0.3.42"

[profile.release]
opt-level = "s"
`;
