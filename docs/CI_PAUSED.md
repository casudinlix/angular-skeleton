# GitHub Actions disabled at user request

The user requested **no CI testing** because their GitHub Actions quota is exhausted.

- The previous `.github/workflows/quality.yml` was removed. No automatic `push` or `pull_request` workflow is configured by this skeleton.
- Do not re-add workflows, trigger `workflow_dispatch`, or schedule GitHub Actions without explicit permission.
- Development quality gates are executed **locally with Bun**. Refer to `docs/TESTING.md`.
- Existing historical Actions runs remain visible in GitHub, but no future runs should be triggered from this repository's current skeleton workflow.
- If CI is reinstated later, migrate installation and cache to **Bun 1.4.4**, use committed `bun.lock` and `bun install --frozen-lockfile`, then restore a workflow after user approval.
