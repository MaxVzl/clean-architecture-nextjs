import type { Container } from "./container";

let container: Container;

if (process.env.NODE_ENV === "production") {
  container = require("./container.prod").container;
} else {
  container = require("./container.dev").container;
}

export { container };
