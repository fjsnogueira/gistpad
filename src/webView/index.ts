import * as vscode from "vscode";

const STYLE_ID = "gistpad-sandbox-style";
export class SandboxWebView {
  private html: string = "";
  private javascript: string = "";
  private css: string = "";

  constructor(private webview: vscode.Webview) {
    webview.onDidReceiveMessage(({ command, value }) => {
      if (command === "alert") {
        if (value) {
          vscode.window.showInformationMessage(value);
        }
      }
    });

    this.rebuildWebview();
  }

  public updateHTML(html: string) {
    this.html = html;
    this.rebuildWebview();
  }

  public updateJavaScript(javascript: string) {
    this.javascript = javascript;
    this.rebuildWebview();
  }

  public updateCSS(css: string) {
    this.css = css;
    this.webview.postMessage({ command: "updateCSS", value: css });
  }

  private rebuildWebview() {
    this.webview.html = `<html>
  <head>
    <style>
      body { background-color: white; }
    </style>
    <style id="${STYLE_ID}">
      ${this.css}
    </style>
    <script>
      document.getElementById("_defaultStyles").remove();

      const vscode = acquireVsCodeApi();
      const style = document.getElementById("${STYLE_ID}");
  
      window.addEventListener("message", ({ data }) => {    
        if (data.command === "updateCSS") {
          style.textContent = data.value;
        }
      });
    
      window.alert = (message) => {
        vscode.postMessage({
          command: "alert",
          value: message
        });
      };

    </script>
  </head>
  <body>
    ${this.html}
    <script>
      ${this.javascript}
    </script>
  </body>
</html>`;
  }
}