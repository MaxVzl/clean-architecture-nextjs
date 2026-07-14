import { withAuth } from "@/lib/helpers/auth.helper";

export default withAuth(({ user }) => {
  return (
    <main>
      <h1>Me</h1>
      <p>{user.name}</p>
    </main>
  );
});

// export default withRoles([Role.ADMIN], ({ user }) => {
//   return (
//     <main>
//       <h1>Me</h1>
//       <p>{user.name}</p>
//     </main>
//   );
// });
