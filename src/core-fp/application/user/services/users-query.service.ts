import { ListUserQuery } from "@/core-fp/application/user/queries/list-user.query";
import { UserDto } from "../dtos/user.dto";

export type UsersQueryService = {
  find(query: ListUserQuery): Promise<UserDto[]>;
  findById(id: string): Promise<UserDto | null>;
};
