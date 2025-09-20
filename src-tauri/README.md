# Tauri Desktop App

This is the backend for the ecom-product-photo-tool desktop application.

## Structure

- `src/main.rs`: The main entry point for the Tauri application
- `Cargo.toml`: Rust package configuration
- `tauri.conf.json`: Tauri configuration file
- `build.rs`: Build script for Tauri
- `icons/`: Application icons

## Development

To develop the application, you need to have Rust and Tauri CLI installed.

```bash
# Install Tauri CLI
cargo install tauri-cli

# Run the application in development mode
cargo tauri dev
```