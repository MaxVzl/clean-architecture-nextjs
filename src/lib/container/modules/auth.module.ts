import { AuthNotifierService } from "@/core/application/auth/services/auth-notifier.service";

export type AuthModuleDeps = {
  authNotifierService: AuthNotifierService;
};

export function createAuthModule(deps: AuthModuleDeps) {
  return {
    authNotifierService: deps.authNotifierService,
  };
}
