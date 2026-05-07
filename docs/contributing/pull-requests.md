# Pull Request Guidelines

What we expect in a PR before review.

## Before opening

- [ ] Branch named `fix/...` (bug), `feat/...` (feature), `chore/...` (maintenance), or `docs/...` (docs only).
- [ ] Commit messages explain the *why*, not just the *what*. One change per commit when practical.
- [ ] `npm run type-check && npm run lint && npm run test` passes locally.
- [ ] If the PR touches a block's `save()`, a `deprecated[]` entry is included.
- [ ] If the PR adds a feature, the relevant doc in `docs/` is updated **in the same PR**.
- [ ] If the PR touches anything provider-related, the provider E2E suite passes.

## PR description should include

1. **What** changed (one-paragraph summary).
2. **Why** — the user-visible problem or motivation.
3. **How to test** — explicit reproduction steps.
4. **Risk surface** — what could break, and what we tested to confirm it doesn't.

If a card exists in FluentBoards (or the Zoobbe board for legacy work), link it.

## Code review checklist

Reviewers will check:

- Does it follow the layer model? (Editor → Core → Provider → Feature_Enhancer → Frontend)
- Does it avoid duplicating logic between free and Pro?
- Is the security checklist met? (escape on output, sanitize on input, nonce on REST)
- Are user-facing strings translatable?
- Does it have tests proportional to the risk?
- Does it touch all five `isSelfHostedVideo` copies if relevant?
- Are deprecations honored on block save() changes?

## Size guidance

- **< 200 LOC** changes: usually fine to ship as a single PR.
- **200–600 LOC**: consider splitting into setup + behavior + UI.
- **> 600 LOC**: split. Reviewers will ask anyway.

## After merge

- The release manager picks up the change. Don't bump version numbers in feature PRs unless instructed — release happens in batched bumps.
- If your change requires a doc-update in `docs/`, ensure it's in this PR; don't leave it for later.

## What gets a PR rejected outright

- Forking free code into Pro (instead of using a filter).
- Block `save()` change without a deprecation entry.
- Hand-modified bundles in `assets/` (always rebuild from source).
- New `vendor/` libs without provenance.
- Translatable strings that aren't translatable.
- Bypassed nonce checks "because it's admin only."
