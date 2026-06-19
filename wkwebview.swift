import Cocoa
import WebKit

let app = NSApplication.shared
app.setActivationPolicy(.regular)

final class Delegate: NSObject, NSApplicationDelegate, WKNavigationDelegate {
    var window: NSWindow!
    var web: WKWebView!

    func applicationDidFinishLaunching(_ note: Notification) {
        let cfg = WKWebViewConfiguration()
        cfg.defaultWebpagePreferences.allowsContentJavaScript = true
        web = WKWebView(frame: NSRect(x: 0, y: 40, width: 420, height: 800), configuration: cfg)
        web.navigationDelegate = self
        if #available(macOS 13.3, *) { web.isInspectable = true }
        web.customUserAgent = "Mozilla/5.0 (Linux; Android 13; SM-A536B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 trill_320404 JsSdk/1.0 AppName/musical_ly app_version/39.0.0 ByteFullLocale/en Region/US"

        let urlStr = CommandLine.arguments.count > 1
            ? CommandLine.arguments[1]
            : "https://si6r.github.io/c-webview-test/"

        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 420, height: 840),
                          styleMask: [.titled, .closable, .resizable],
                          backing: .buffered, defer: false)
        window.center()
        window.title = "WKWebView · " + urlStr
        window.contentView = web
        window.makeKeyAndOrderFront(nil)

        web.load(URLRequest(url: URL(string: urlStr)!))
        NSApp.activate(ignoringOtherApps: true)
    }

    func webView(_ wv: WKWebView, decidePolicyFor action: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let u = action.request.url?.absoluteString,
           !u.hasPrefix("http"), !u.hasPrefix("about") {
            NSLog("WKWebView external scheme navigation: %@", u)
        }
        decisionHandler(.allow)
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ s: NSApplication) -> Bool { true }
}

let delegate = Delegate()
app.delegate = delegate
app.run()
