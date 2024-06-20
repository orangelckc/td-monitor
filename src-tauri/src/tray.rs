use tauri::{AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

// 加载菜单
pub fn menu() -> SystemTray {
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show".to_string(), "显示窗口"))
        .add_item(CustomMenuItem::new("switch".to_string(), "切换开关"))
        .add_item(CustomMenuItem::new("about".to_string(), "关于"))
        .add_item(CustomMenuItem::new("quit".to_string(), "退出"));

    SystemTray::new().with_menu(tray_menu)
}

// 菜单事件
pub fn handler(app: &AppHandle, event: SystemTrayEvent) {
    let window = app.get_window("main").unwrap();

    match event {
        SystemTrayEvent::LeftClick { .. } => {}
        SystemTrayEvent::DoubleClick { .. } => {
            window.show().unwrap();
            window.set_focus().unwrap();
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "show" => app.windows().values().for_each(|window| {
                window.show().unwrap();
                window.set_focus().unwrap();
            }),
            "switch" => window.emit("trigger-switch", {}).unwrap(),
            "about" => window.emit("trigger-about", {}).unwrap(),
            "quit" => std::process::exit(0),
            _ => {}
        },
        _ => {}
    }
}
