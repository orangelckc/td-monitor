#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{generate_context, ActivationPolicy};
mod tray;
use tray::{handler, menu};

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            #[cfg(target_os = "macos")]
            _app.set_activation_policy(ActivationPolicy::Accessory);

            #[cfg(target_os = "windows")]
            set_shadow(&_app.get_window("main").unwrap(), true).expect("Unsupported platform!");

            Ok(())
        })
        .system_tray(menu())
        .on_system_tray_event(handler)
        .run(generate_context!())
        .expect("error while running tauri application");
}
