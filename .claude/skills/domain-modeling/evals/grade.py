"""Grade a domain-modeling eval run: python grade.py <run_dir> <eval_name>

<run_dir> contains project/ (git repo, base commit = initial state) and outputs/.
Writes <run_dir>/grading.json and outputs/changes.diff.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

run_dir = Path(sys.argv[1])
eval_name = sys.argv[2]
project = run_dir / "project"


def sh(cmd: str) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, shell=True, cwd=project, capture_output=True, text=True)


sh("git add -A")
diff = sh("git diff --cached HEAD -- . ':(exclude)node_modules'").stdout
(run_dir / "outputs" / "changes.diff").write_text(diff)
changed = [
    l.split("\t")[-1]
    for l in sh("git diff --cached --name-status HEAD").stdout.splitlines()
    if not l.startswith("D")
]
changed_ts = [f for f in changed if f.endswith(".ts")]


def read(f: str) -> str:
    return (project / f).read_text()


# Locate the domain root: the directory containing common/entity.base.ts
bases = list(project.glob("src/**/common/entity.base.ts"))
domain_root = (
    str(bases[0].parent.parent.relative_to(project)) + "/" if bases else "src/"
)
domain_changed = [f for f in changed_ts if f.startswith(domain_root)]

results = []


def check(text: str, passed: bool, evidence: str) -> None:
    results.append({"text": text, "passed": bool(passed), "evidence": evidence})


# ---------- Common assertions ----------
tsc = sh("npx tsc --noEmit -p .")
check(
    "Le projet compile (tsc --noEmit sans erreur)",
    tsc.returncode == 0,
    "OK" if tsc.returncode == 0 else tsc.stdout[:600],
)

offenders = [f for f in domain_changed if re.search(r"throw new Error\(", read(f))]
check(
    "Aucun `throw new Error(` dans le code de domaine écrit",
    not offenders,
    f"Fichiers fautifs : {offenders}" if offenders else f"{len(domain_changed)} fichiers vérifiés",
)

CATEGORIES = r"(NotFoundError|ConflictError|ForbiddenError|BusinessRuleError|ValidationError)"
error_files = [
    f for f in domain_changed if "/errors/" in f and "/common/" not in f
]
bad_cat, bad_code = [], []
for f in error_files:
    src = read(f)
    for m in re.finditer(r"class (\w+) extends (\w+)", src):
        if not re.fullmatch(CATEGORIES, m.group(2)):
            bad_cat.append(f"{m.group(1)} extends {m.group(2)}")
    if not re.search(r"code:\s*\"[A-Z][A-Z0-9_]+\"", src):
        bad_code.append(f)
check(
    "Les erreurs créées héritent d'une catégorie (NotFound/Conflict/Forbidden/BusinessRule/Validation)",
    error_files and not bad_cat,
    f"Pas de fichier d'erreur dans un dossier errors/ de feature" if not error_files
    else (f"Écarts : {bad_cat}" if bad_cat else f"{len(error_files)} erreurs conformes"),
)
check(
    "Chaque erreur créée porte un `code` stable en SCREAMING_SNAKE_CASE",
    error_files and not bad_code,
    "Pas de fichier d'erreur" if not error_files
    else (f"Sans code : {bad_code}" if bad_code else "Tous les fichiers d'erreur ont un code"),
)

entity_files = [f for f in domain_changed if f.endswith(".entity.ts")]
time_offenders = [
    f for f in entity_files if re.search(r"new Date\(\s*\)|Date\.now\(", read(f))
]
check(
    "Les entités ne lisent pas l'heure elles-mêmes (pas de `new Date()` / `Date.now()`)",
    entity_files and not time_offenders,
    "Aucune entité modifiée" if not entity_files
    else (f"Fautifs : {time_offenders}" if time_offenders else f"{len(entity_files)} entités vérifiées"),
)

import_offenders = []
for f in domain_changed:
    for m in re.finditer(r'from\s+"([^"]+)"', read(f)):
        mod = m.group(1)
        ok = (
            mod.startswith(".")
            or mod in ("zod", "uuid")
            or ("/domain/" in mod and mod.startswith("@/"))
        )
        if not ok:
            import_offenders.append(f"{f} -> {mod}")
check(
    "Le domaine n'importe que du domaine, zod et uuid",
    not import_offenders,
    f"Imports interdits : {import_offenders}" if import_offenders else "OK",
)

PLURAL = r"(^|[/-])(comments|users|posts|organizations|members|memberships|bans)([./-]|$)"
plural_files = [f for f in changed if re.search(PLURAL, f)]
check(
    "Nommage au singulier pour les fichiers et dossiers de feature",
    not plural_files,
    f"Pluriels : {plural_files}" if plural_files else "OK",
)


def find(pattern: str) -> list[str]:
    return [f for f in changed_ts if re.search(pattern, f)]


def any_src(files: list[str], pattern: str) -> bool:
    return any(re.search(pattern, read(f), re.S) for f in files)


# ---------- Eval-specific assertions ----------
if eval_name == "comment-feature":
    idf = find(r"comment/value-objects/comment-id\.vo\.ts$")
    check(
        "CommentId est un VO dédié et préfixé (comment-<uuid>) dans domain/comment/value-objects/",
        idf and any_src(idf, r"\"comment\"|entityIdSchema\(\s*\"comment\""),
        f"Fichier : {idf}" if idf else f"Introuvable. Fichiers : {changed_ts}",
    )
    ent = find(r"comment/entities/comment\.entity\.ts$")
    check(
        "L'entité Comment référence l'auteur et le post par leurs ids typés (UserId, PostId)",
        ent and any_src(ent, r"UserId") and any_src(ent, r"PostId"),
        f"Fichier : {ent}" if ent else "Entité introuvable",
    )
    vo2000 = [f for f in find(r"\.vo\.ts$") if re.search(r"2000|2_000", read(f))]
    check(
        "Le contenu (1 à 2000 caractères) est un value object avec la règle dans son schéma",
        bool(vo2000),
        f"VO : {vo2000}" if vo2000 else "Aucun VO ne contient la limite 2000",
    )
    check(
        "La fenêtre de 15 minutes est vérifiée dans l'entité, avec une date reçue en paramètre",
        ent and any_src(ent, r"15") and any_src(ent, r"\w+\([^)]*:\s*Date[^)]*\)"),
        f"Fichier : {ent}" if ent else "Entité introuvable",
    )
    repo = find(r"comment/repositories/comment\.repository\.ts$")
    check(
        "Port CommentRepository déclaré dans domain/comment/repositories/comment.repository.ts",
        repo and any_src(repo, r"interface CommentRepository"),
        f"Fichier : {repo}" if repo else "Introuvable",
    )

elif eval_name == "user-ban":
    ent = find(r"user/entities/user\.entity\.ts$")
    reason = [f for f in find(r"user/value-objects/.*\.vo\.ts$") if "reason" in f]
    check(
        "La raison de bannissement est un value object de la feature user",
        bool(reason),
        f"VO : {reason}" if reason else f"Aucun VO *reason*. VO modifiés : {find(r'.vo.ts$')}",
    )
    errs = find(r"user/errors/.*\.error\.ts$")
    check(
        "Au moins deux erreurs dédiées (admin non bannissable, déjà banni) dans user/errors/",
        len([e for e in errs if "not-found" not in e]) >= 2,
        f"Erreurs : {errs}",
    )
    uid_changed = find(r"user/value-objects/user-id\.vo\.ts$")
    check(
        "UserId n'est pas modifié (id géré par une librairie externe, schéma z.string())",
        not uid_changed,
        "Modifié" if uid_changed else "Inchangé",
    )
    check(
        "create() initialise un utilisateur non banni",
        ent and any_src(ent, r"static create\(.*?(banned\w*|ban\w*):\s*(null|false)"),
        "Valeur par défaut trouvée dans create()" if ent and any_src(ent, r"static create\(.*?(banned\w*|ban\w*):\s*(null|false)") else "Pas de valeur par défaut explicite trouvée dans create()",
    )

elif eval_name == "organization-new-project":
    needed = ["entity.base.ts", "value-object.base.ts", "errors/domain.error.ts", "errors/business-rule.error.ts"]
    missing = [n for n in needed if not list(project.glob(f"src/**/common/{n}"))]
    check(
        "Les classes de base (Entity, defineValueObject, DomainError, catégories) sont créées dans common/",
        not missing,
        f"Manquants : {missing}" if missing else f"Racine domaine : {domain_root}",
    )
    idf = find(r"organization/value-objects/organization-id\.vo\.ts$")
    check(
        "OrganizationId est un VO dédié et préfixé, dans organization/value-objects/",
        idf and any_src(idf, r"\"org(anization)?\""),
        f"Fichier : {idf}" if idf else f"Introuvable. Fichiers : {changed_ts}",
    )
    slug = [f for f in find(r"\.vo\.ts$") if "slug" in f]
    check(
        "Le slug est un value object avec une regex de format",
        slug and any_src(slug, r"regex"),
        f"VO : {slug}" if slug else "Aucun VO slug",
    )
    enum = [f for f in find(r"\.enum\.ts$") if "role" in f]
    check(
        "Le rôle est un enum `as const` (owner, admin, member)",
        enum and any_src(enum, r"as const") and any_src(enum, r"owner") and any_src(enum, r"member"),
        f"Enum : {enum}" if enum else "Aucun fichier *role*.enum.ts",
    )
    owner_err = [
        f for f in find(r"/errors/.*\.error\.ts$")
        if "owner" in f and re.search(r"extends BusinessRuleError", read(f))
    ]
    check(
        "L'invariant « au moins un owner » lève une BusinessRuleError dédiée",
        bool(owner_err),
        f"Erreur : {owner_err}" if owner_err else f"Erreurs : {find(r'/errors/')}",
    )

passed = sum(r["passed"] for r in results)
grading = {
    "expectations": results,
    "summary": {
        "passed": passed,
        "failed": len(results) - passed,
        "total": len(results),
        "pass_rate": round(passed / len(results), 2),
    },
}
(run_dir / "grading.json").write_text(json.dumps(grading, ensure_ascii=False, indent=2))
print(f"{eval_name} {run_dir.name}: {passed}/{len(results)}")
for r in results:
    print(("  OK  " if r["passed"] else "  KO  ") + r["text"])
