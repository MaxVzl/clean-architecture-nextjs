import { err, ok, Result } from "neverthrow";

type Error = {
  message: string;
};

const getName = (name: string): Result<string, Error> => {
  if (name === "Doe") {
    return err({ message: "Name is not Doe" });
  }
  return ok(name);
};

const result = getName("John");

// console.log(result);

if (result.isErr()) {
  console.log(result.error);
} else {
  console.log(result.value);
}

// result.map((name) => console.log(name));
// result.mapErr((error) => console.log(error.message));

// result.match(
//   (name) => console.log(name),
//   (error) => console.log(error.message),
// );
