import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Hello World</h1>
      <ul>
        <li>
          <Link href="/me">Me</Link>
        </li>
        <li>
          <Link href="/users">Users</Link>
        </li>
      </ul>
    </main>
  );
}
