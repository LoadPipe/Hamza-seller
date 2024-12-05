import Widget0, { config as widgetConfig0 } from "./widgets/product-widget"
import Widget1, { config as widgetConfig1 } from "./widgets/wallet-login"
import Page0, { config as routeConfig0 } from "./routes/custom/page"
import Page1 from "./routes/walletLogin/page"

const LocalEntry = {
  identifier: "local",
  extensions: [
    { Component: Widget0, config: { ...widgetConfig0, type: "widget" } },
    { Component: Widget1, config: { ...widgetConfig1, type: "widget" } },
    { Component: Page0, config: { ...routeConfig0, type: "route",  path: "/custom" } },
    { Component: Page1, config: { path: "/walletLogin", type: "route" } }
  ],
}

export default LocalEntry