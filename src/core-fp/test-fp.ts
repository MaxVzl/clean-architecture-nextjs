import { container } from "@/core-fp/di/container.prod";

const { createUserUseCase, usersQueryService } = container;

createUserUseCase({ name: "John Doe", email: "john.doe@example.com" }).then(
  (user) => {
    console.log(user);
  },
);

createUserUseCase({ name: "Jane Doe", email: "jane.doe@example.com" }).then(
  (user) => {
    console.log(user);
  },
);

usersQueryService.find({}).then((users) => {
  console.log(users);
});

usersQueryService.findById("1").then((user) => {
  console.log(user);
});
