import type { Container } from "./container";

let container: Container;

if (process.env.NODE_ENV === "production") {
  container = (await import("./container.prod")).prodContainer;
} else {
  container = (await import("./container.dev")).container;
}

export { container };
