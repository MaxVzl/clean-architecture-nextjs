"""Grade a backend-architecture eval run: python grade.py <run_dir> <eval_name>

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
outputs = run_dir / "outputs"


def sh(cmd: str) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, shell=True, cwd=project, capture_output=True, text=True)


sh("git add -A")
diff = sh("git diff --cached HEAD -- . ':(exclude)node_modules'").stdout
(outputs / "changes.diff").write_text(diff)
changed = [
    l.split("\t")[-1]
    for l in sh("git diff --cached --name-status HEAD").stdout.splitlines()
    if not l.startswith("D")
]
changed_ts = [f for f in changed if re.search(r"\.tsx?$", f)]


def read(f: str) -> str:
    p = project / f
    return p.read_text() if p.exists() else ""


def exists(f: str) -> bool:
    return (project / f).exists()


def grep(files: list[str], pattern: str) -> list[str]:
    return [f for f in files if re.search(pattern, read(f), re.S)]


results = []


def check(text: str, passed, evidence: str) -> None:
    results.append({"text": text, "passed": bool(passed), "evidence": evidence})


C = "src/core/"


def build_checks() -> None:
    tsc = sh("npx tsc --noEmit -p .")
    check(
        "Le projet compile (tsc --noEmit sans erreur)",
        tsc.returncode == 0,
        "OK" if tsc.returncode == 0 else tsc.stdout[:600],
    )
    lint = sh("npx eslint src")
    boundary = lint.stdout.count("no-restricted-paths")
    check(
        "Le lint passe, y compris la règle de dépendance entre couches",
        lint.returncode == 0,
        "OK" if lint.returncode == 0
        else f"{boundary} violation(s) de couche ; extrait : {lint.stdout[:500]}",
    )
    core_changed = [f for f in changed_ts if f.startswith(C + "domain/") or f.startswith(C + "application/")]
    bad = grep(core_changed, r"throw new Error\(")
    check(
        "Aucun `throw new Error(` dans le domaine ou l'application",
        not bad,
        f"Fautifs : {bad}" if bad else f"{len(core_changed)} fichiers vérifiés",
    )
    plural = [f for f in changed if re.search(r"(^|[/-])(tags|posts|users)([./-])", f) and "src/app/" not in f]
    check(
        "Nommage au singulier pour les fichiers et dossiers de feature",
        not plural,
        f"Pluriels : {plural}" if plural else "OK",
    )


if eval_name == "tag-feature":
    build_checks()
    dom = [f for f in changed_ts if f.startswith(C + "domain/tag/")]
    check(
        "Domaine tag : entité, TagId préfixé et port TagRepository",
        exists(C + "domain/tag/entities/tag.entity.ts")
        and grep([f for f in dom if "tag-id.vo" in f], r"\"tag\"")
        and exists(C + "domain/tag/repositories/tag.repository.ts"),
        f"Fichiers domaine : {dom}",
    )
    conflict = [
        f for f in changed_ts
        if "/domain/tag/errors/" in f and re.search(r"extends ConflictError", read(f)) and re.search(r"code:\s*\"[A-Z_]+\"", read(f))
    ]
    uc = [f for f in changed_ts if re.search(r"application/tag/use-cases/create-tag\.use-case\.ts$", f)]
    check(
        "L'unicité du nom est vérifiée dans le use case CreateTag et lève une ConflictError codée",
        conflict and uc and grep(uc, r"throw new \w+Error"),
        f"Erreurs Conflict : {conflict} ; use case : {uc}",
    )
    rm_port = [f for f in changed_ts if re.search(r"application/tag/read-models/tag\.read-model\.ts$", f)]
    rm_impl = [f for f in changed_ts if re.search(r"infrastructure/tag/read-models/drizzle-tag\.read-model\.ts$", f)]
    repo_paginates = grep([C + "domain/tag/repositories/tag.repository.ts"], r"limit|offset|Paginated|findAll|list")
    check(
        "La liste paginée passe par un read model (port + implémentation Drizzle), pas par le repository",
        rm_port and rm_impl and not repo_paginates,
        f"Port : {rm_port} ; impl : {rm_impl} ; pagination dans le repository : {bool(repo_paginates)}",
    )
    infra = [
        C + "infrastructure/tag/schemas/drizzle-tag.schema.ts",
        C + "infrastructure/tag/mappers/drizzle-tag.mapper.ts",
        C + "infrastructure/tag/repositories/drizzle-tag.repository.ts",
    ]
    missing = [f for f in infra if not exists(f)]
    check(
        "Infrastructure tag : schéma (table \"tags\"), mapper et repository Drizzle aux bons emplacements",
        not missing and re.search(r"sqliteTable\(\s*\"tags\"", read(infra[0])),
        f"Manquants : {missing}" if missing else "OK",
    )
    check(
        "Le module tag est câblé dans le composition root (module, container, containers dev/prod)",
        exists("src/lib/container/modules/tag.module.ts")
        and "createTagModule" in read("src/lib/container/container.ts")
        and "Tag" in read("src/lib/container/container.dev.ts")
        and "Tag" in read("src/lib/container/container.prod.ts"),
        "Vérifié : modules/tag.module.ts, container.ts, container.dev.ts, container.prod.ts",
    )
    check(
        "Routes, controller et router tag exposés et montés dans l'API",
        exists(C + "presentation/routes/tag.routes.ts")
        and exists(C + "presentation/controllers/tag.controller.ts")
        and exists(C + "presentation/routers/tag.router.ts")
        and re.search(r"tagRouter", read("src/app/api/[[...route]]/route.ts")),
        "Fichiers routes/controller/router + montage vérifiés",
    )
    admin = [
        f for f in changed_ts
        if (f.startswith(C + "presentation/") or f.startswith(C + "application/tag/") or f.startswith(C + "domain/") or "src/app/api" in f)
        and re.search(r"Role\.ADMIN|isAdmin|\"admin\"", read(f))
    ]
    check(
        "La création de tag est réservée aux admins (quelle que soit la couche qui le vérifie)",
        bool(admin),
        f"Vérification trouvée dans : {admin}" if admin else "Aucune vérification de rôle trouvée",
    )

elif eval_name == "delete-post":
    build_checks()
    forb = [
        f for f in changed_ts
        if "/domain/post/errors/" in f and re.search(r"extends ForbiddenError", read(f)) and re.search(r"code:\s*\"[A-Z_]+\"", read(f))
    ]
    ent = read(C + "domain/post/entities/post.entity.ts")
    check(
        "La règle « seul l'auteur » est dans le domaine (méthode de Post qui lève une ForbiddenError codée)",
        forb and re.search(r"Error\(", ent) and re.search(r"authorId", ent),
        f"Erreurs Forbidden : {forb}",
    )
    uc = C + "application/post/use-cases/delete-post.use-case.ts"
    check(
        "Un DeletePostUseCase orchestre : findById, règle du domaine, suppression",
        exists(uc) and re.search(r"findById", read(uc)) and re.search(r"delete|remove", read(uc)),
        "Présent" if exists(uc) else "delete-post.use-case.ts introuvable",
    )
    port = read(C + "domain/post/repositories/post.repository.ts")
    impl = read(C + "infrastructure/post/repositories/drizzle-post.repository.ts")
    check(
        "PostRepository expose findById et une suppression, implémentées par DrizzlePostRepository",
        re.search(r"findById", port) and re.search(r"delete|remove", port)
        and re.search(r"findById", impl) and re.search(r"\.delete\(", impl),
        "Port et implémentation vérifiés",
    )
    action = read(C + "presentation/actions/post.actions.ts")
    check(
        "La server action passe par authClient et tire l'acteur de la session (ctx.session.user.id)",
        re.search(r"deletePost\w*\s*=\s*authClient", action) and re.search(r"ctx\.session\.user\.id", action.split("deletePost")[-1]),
        "Action vérifiée" if "deletePost" in action else "Pas d'action deletePost dans post.actions.ts",
    )
    check(
        "Le use case est instancié dans le module post et exporté par le container",
        "DeletePostUseCase" in read("src/lib/container/modules/post.module.ts")
        and "deletePostUseCase" in read("src/lib/container/index.ts"),
        "Vérifié dans post.module.ts et index.ts",
    )

elif eval_name == "architecture-review":
    report = ""
    for p in outputs.glob("*.md"):
        report += p.read_text()
    src_changed = [f for f in changed if f.startswith("src/")]
    check(
        "La revue ne modifie pas le code",
        not src_changed,
        f"Modifiés : {src_changed}" if src_changed else "Aucun fichier source modifié",
    )

    def near(a: str, b: str, window: int = 700) -> bool:
        for m in re.finditer(a, report, re.I):
            chunk = report[max(0, m.start() - window): m.end() + window]
            if re.search(b, chunk, re.I):
                return True
        return False

    findings = [
        ("Repère que CreateUserUseCase (application) importe Drizzle / la base",
         r"create-user\.use-case", r"drizzle|\bdb\b|infrastructure|database"),
        ("Repère que UserController (présentation) interroge directement la base",
         r"user\.controller", r"drizzle|\bdb\b|infrastructure|database"),
        ("Repère le fichier au pluriel posts.repository.ts",
         r"posts\.repository", r"pluriel|singulier|plural|nommage|naming"),
        ("Repère la recherche paginée searchByName dans le repository (relève d'un read model)",
         r"searchByName", r"read.?model|lecture|CQRS|pagin"),
        ("Repère le `throw new Error` dans CreatePostUseCase",
         r"throw new Error|new Error\(", r"create-post|CreatePost|catégor|DomainError|NotFound"),
        ("Repère que POST /users/:userId/posts prend l'acteur dans l'URL au lieu de la session",
         r"post\.controller|createUserPostRoute|users/:userId/posts", r"session|usurp|param|URL|n'importe qui|authent"),
    ]
    for text, a, b in findings:
        check(text, near(a, b), "Trouvé dans le rapport" if near(a, b) else "Absent du rapport")

elif eval_name == "backend-setup":
    tsc = sh("npx tsc --noEmit -p .")
    check("Le projet compile (tsc --noEmit sans erreur)", tsc.returncode == 0,
          "OK" if tsc.returncode == 0 else tsc.stdout[:600])
    roots = [d for d in project.glob("src/**/") if all((d / l).is_dir() for l in ("domain", "application", "infrastructure", "presentation"))]
    root = str(roots[0].relative_to(project)) + "/" if roots else None
    files = [f for f in changed_ts if not f.startswith("src/app/")]
    layer = lambda l: [f for f in files if f"/{l}/" in f]
    has_layers = all(layer(l) for l in ("domain", "application", "infrastructure", "presentation"))
    check("Le backend est découpé en 4 couches (domain, application, infrastructure, presentation), quel que soit le découpage",
          has_layers, "Les 4 couches sont présentes" if has_layers else "Couches manquantes")
    check("Convention : arborescence : couche d'abord, puis feature (src/core/<couche>/<feature>/)",
          bool(root), f"Racine : {root}" if root else "Autre découpage (pas de dossier contenant les 4 couches)")
    R = root or "src/"

    def imports(f):
        return re.findall(r'from\s+"([^"]+)"', read(f))
    bad_dom = [f"{f} -> {m}" for f in layer("domain") for m in imports(f)
               if not (m.startswith(".") or m in ("zod", "uuid") or (m.startswith("@/") and "/domain/" in m) or (m.startswith("@/") and "/domain" in m))]
    check("Le domaine n'importe que du domaine, zod et uuid", layer("domain") and not bad_dom,
          f"Imports interdits : {bad_dom[:5]}" if bad_dom else "OK")
    bad_app = [f"{f} -> {m}" for f in layer("application") for m in imports(f)
               if re.search(r"infrastructure|presentation|drizzle|hono|next|@libsql", m)]
    check("L'application n'importe ni infrastructure, ni présentation, ni technologie (drizzle, hono, next)",
          layer("application") and not bad_app, f"Imports interdits : {bad_app[:5]}" if bad_app else "OK")
    bad_pres = [f"{f} -> {m}" for f in layer("presentation") for m in imports(f) if "infrastructure" in m or "drizzle" in m]
    check("La présentation n'importe pas l'infrastructure", layer("presentation") and not bad_pres,
          f"Imports interdits : {bad_pres[:5]}" if bad_pres else "OK")
    containers = [f for f in files if re.search(r"container", f) and not re.search(r"/(domain|application|infrastructure|presentation)/", f)]
    check("Un composition root, hors des couches, assemble les implémentations",
          bool(containers), f"Container : {containers}")
    modules = [f for f in files if f.endswith(".module.ts")]
    check("Convention : le composition root est découpé en un module par feature",
          len(modules) >= 2, f"Modules : {modules}")
    ucs = [f for f in layer("application") if f.endswith(".use-case.ts")]
    check("Les 3 écritures passent par des use cases (*.use-case.ts)", len(ucs) >= 3, f"Use cases : {ucs}")
    rm_port = [f for f in layer("application") if f.endswith(".read-model.ts")]
    rm_impl = [f for f in layer("infrastructure") if f.endswith(".read-model.ts")]
    check("La liste des tâches passe par un read model (port dans application, implémentation dans infrastructure)",
          rm_port and rm_impl, f"Ports : {rm_port} ; impl : {rm_impl}")
    repo_port = [f for f in layer("domain") if re.search(r"repositor", f) and re.search(r"interface \w+Repository", read(f))]
    repo_impl = [f for f in layer("infrastructure") if re.search(r"drizzle", f) and re.search(r"implements \w+Repository", read(f))]
    check("Ports de repository déclarés dans le domaine, implémentés par une classe Drizzle dans l'infrastructure",
          repo_port and repo_impl, f"Ports : {repo_port} ; impl : {repo_impl}")
    task_dom = [f for f in layer("domain") if "task" in f]
    check("« Marquer une tâche comme faite » est une méthode métier du domaine Task",
          any(re.search(r"\b(complete|markAs\w*|finish|done)\w*\(", read(f)) for f in task_dom), f"Fichiers : {task_dom}")
    coded = [f for f in layer("domain") if re.search(r'code:\s*"[A-Z_]+"|code = "[A-Z_]+"', read(f))]
    check("Les erreurs métier portent un code stable", bool(coded), f"Fichiers avec codes : {coded}")
    # ---- Conventions du projet (nommage et outillage) ----
    suffixes = {
        "entité .entity.ts": [f for f in layer("domain") if f.endswith(".entity.ts")],
        "VO .vo.ts": [f for f in layer("domain") if f.endswith(".vo.ts")],
        "port .repository.ts": [f for f in layer("domain") if f.endswith(".repository.ts")],
        "use case .use-case.ts": [f for f in layer("application") if f.endswith(".use-case.ts")],
    }
    missing = [k for k, v in suffixes.items() if not v]
    check("Convention : suffixes de fichiers (.entity.ts, .vo.ts, .repository.ts, .use-case.ts)", not missing,
          f"Manquants : {missing}" if missing else "Tous présents")
    ids = [f for f in layer("domain") if re.search(r"(project|task)-id\.vo\.ts$", f)]
    check("Convention : un VO d'identifiant préfixé par entité (project-id.vo.ts, task-id.vo.ts)", len(ids) >= 2, f"VO d'id : {ids}")
    errs = [f for f in layer("domain") if "/errors/" in f and "/common/" not in f]
    bad_errs = [f for f in errs if not re.search(r"extends (NotFound|Conflict|Forbidden|BusinessRule|Validation)Error", read(f))]
    check("Convention : une erreur par fichier dans errors/, héritant d'une catégorie (NotFound, Conflict…)",
          errs and not bad_errs, f"Non conformes : {bad_errs}" if bad_errs else f"Erreurs : {errs}")
    eslint_cfg = read("eslint.config.mjs")
    check("Convention : la règle ESLint de dépendance entre couches est ajoutée (import/no-restricted-paths)",
          "no-restricted-paths" in eslint_cfg, "Présente" if "no-restricted-paths" in eslint_cfg else "Absente")
    plural = [f for f in changed if re.search(r"(^|[/-])(projects|tasks)([./-])", f) and "src/app/" not in f]
    check("Convention : nommage au singulier pour les fichiers et dossiers de feature", not plural,
          f"Pluriels : {plural}" if plural else "OK")

elif eval_name == "messy-project-feature":
    tsc = sh("npx tsc --noEmit -p .")
    check("Le projet compile (tsc --noEmit sans erreur)", tsc.returncode == 0,
          "OK" if tsc.returncode == 0 else tsc.stdout[:600])
    new_cat = [f for f in changed_ts if "categor" in f]
    lint = sh("npx eslint " + " ".join(f"'{f}'" for f in new_cat)) if new_cat else None
    check("Les fichiers de la feature passent le lint", new_cat and lint.returncode == 0,
          "OK" if new_cat and lint.returncode == 0 else (lint.stdout[:400] if lint else "Aucun fichier category"))
    bad = []
    for f in new_cat:
        for m in re.findall(r'from\s+"([^"]+)"', read(f)):
            if (f.startswith(C + "application/") and re.search(r"infrastructure|presentation|drizzle", m)) \
               or (f.startswith(C + "presentation/") and ("infrastructure" in m or "drizzle" in m)) \
               or (f.startswith(C + "domain/") and not (m.startswith(".") or m in ("zod", "uuid") or "/domain/" in m)):
                bad.append(f"{f} -> {m}")
    check("La feature ne recopie pas les violations de couches du projet (pas d'import interdit)", new_cat and not bad,
          f"Imports interdits : {bad}" if bad else "OK")
    errs = grep([f for f in new_cat if f.startswith(C + "domain/") or f.startswith(C + "application/")], r"throw new Error\(")
    check("Aucun `throw new Error(` dans le nouveau code de domaine/application", not errs,
          f"Fautifs : {errs}" if errs else "OK")
    conflict = [f for f in new_cat if "/errors/" in f and re.search(r"extends ConflictError", read(f)) and re.search(r'code:\s*"[A-Z_]+"', read(f))]
    uc = [f for f in new_cat if f.endswith(".use-case.ts")]
    check("Création via un use case qui vérifie l'unicité et lève une ConflictError codée",
          conflict and uc and grep(uc, r"throw new \w+Error"), f"Erreurs : {conflict} ; use cases : {uc}")
    rm = [f for f in new_cat if f.endswith(".read-model.ts")]
    repo = [f for f in new_cat if f.startswith(C + "domain/") and f.endswith(".repository.ts")]
    check("La liste paginée passe par un read model, pas par le repository",
          len(rm) >= 2 and not grep(repo, r"limit|offset|Paginated|search|findAll"), f"Read models : {rm} ; repository : {repo}")
    check("La feature est câblée dans le composition root",
          any("category.module" in f for f in changed) and "ategory" in read("src/lib/container/container.ts"),
          f"Fichiers container modifiés : {[f for f in changed if 'container' in f]}")
    pres_admin = [f for f in new_cat + ["src/app/api/[[...route]]/route.ts"] if (f.startswith(C + "presentation/") or "src/app" in f) and re.search(r"Role\.ADMIN|rolesClient|requireRole|requireAdmin|isAdmin\(|role\s*[!=]==", read(f))]
    check("Le rôle admin est vérifié dans un point d'entrée de la présentation", bool(pres_admin),
          f"Trouvé dans : {pres_admin}" if pres_admin else "Pas de contrôle de rôle dans la présentation")
    plural = [f for f in changed if re.search(r"(^|[/-])categories([./-])", f) and "src/app/" not in f]
    check("Nommage au singulier pour les fichiers de la feature", new_cat and not plural,
          f"Pluriels : {plural}" if plural else "OK")
    planted = [C + "application/user/use-cases/create-user.use-case.ts", C + "presentation/controllers/user.controller.ts",
               C + "domain/post/repositories/posts.repository.ts", C + "application/post/use-cases/create-post.use-case.ts",
               C + "infrastructure/user/repositories/drizzle-user.repository.ts"]
    touched = [f for f in planted if f in changed or not exists(f)]
    check("Les violations existantes hors périmètre ne sont pas modifiées", not touched,
          f"Modifiés : {touched}" if touched else "Aucun fichier existant fautif modifié")
    summary = "".join(p.read_text() for p in outputs.glob("*.md"))
    flagged = [k for k in ["create-user.use-case", "user.controller", "posts.repository", "searchByName", "throw new Error"]
               if re.search(re.escape(k), summary, re.I)]
    check("Le compte rendu signale au moins 2 des violations existantes", len(flagged) >= 2, f"Signalées : {flagged}")

passed = sum(r["passed"] for r in results)
grading = {
    "expectations": results,
    "summary": {
        "passed": passed,
        "failed": len(results) - passed,
        "total": len(results),
        "pass_rate": round(passed / len(results), 2) if results else 0,
    },
}
(run_dir / "grading.json").write_text(json.dumps(grading, ensure_ascii=False, indent=2))
print(f"{eval_name} {run_dir.parent.name}: {passed}/{len(results)}")
for r in results:
    print(("  OK  " if r["passed"] else "  KO  ") + r["text"] + ("" if r["passed"] else f"  [{r['evidence'][:160]}]"))
