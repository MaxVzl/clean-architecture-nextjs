import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const UUID_PATTERN =
  "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

/** Schéma d'un identifiant d'entité préfixé : `<prefix>-<uuid v4>`. */
export const entityIdSchema = (prefix: string) =>
  z.string().regex(new RegExp(`^${prefix}-${UUID_PATTERN}$`, "i"));

/** Génère la valeur brute d'un identifiant d'entité préfixé. */
export const generateEntityId = (prefix: string) => `${prefix}-${uuidv4()}`;
