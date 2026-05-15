import { Button, Html, Head, Body, Heading, Text } from "react-email";
import * as React from "react";

export default function PostCreatedEmail({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Html>
      <Head />
      <Body>
        <Heading>{title}</Heading>
        <Text>{description}</Text>
        <Button
          href="https://example.com"
          style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
        >
          Click me
        </Button>
      </Body>
    </Html>
  );
}
