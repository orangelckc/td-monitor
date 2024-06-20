#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::generate_context;
mod tray;
use tray::{handler, menu};

fn main() {
    tauri::Builder::default()
        .system_tray(menu())
        .on_system_tray_event(handler)
        .run(generate_context!())
        .expect("error while running tauri application");
}
