import type { Container } from "./container";

let container: Container;

if (process.env.NODE_ENV === "production") {
  container = require("./container.prod").prodContainer;
} else {
  container = require("./container.dev").devContainer;
}

export { container };
