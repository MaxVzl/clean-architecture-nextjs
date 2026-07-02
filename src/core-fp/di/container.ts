import {
  createUserModule,
  UserModuleDeps,
} from "@/core-fp/di/modules/user.module";

type ContainerDeps = UserModuleDeps;

export function createContainer(deps: ContainerDeps) {
  return {
    ...createUserModule(deps),
  };
}

export type Container = ReturnType<typeof createContainer>;
