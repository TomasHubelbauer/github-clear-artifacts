# GitHub Clear Workflow Artifacts

This document lists the steps needed to take in order to mass-delete workflow
artifacts in GitHub Actions.

GitHub Actions web UI only allows deleting artifacts one by one for each run of
the workflow.
Some workflow run daily or even hourly and the number of runs may rise into the
thousands before you receive the email about running out of artifact storage and
become motivated to manage it.
Hence the need for a programmatic approach to the artifact removal challenge.

It is also a good idea to change the artifact retention settings from the 90 day
default period to something more reasonable.
For my use-case, I went with a single day retention period as the artifacts are
mostly logs used for debugging which are either used essentially right away or
never.

## 1. Obtain an fine-grained personal access token (PAT) to use with the API

If you're targetting organizational repositories, ensure personal access token
access for the repositories is enabled:
https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/setting-a-personal-access-token-policy-for-your-organization

- Go to https://github.com/settings/tokens?type=beta
- Click on *Generate new token*
- Name it - I chose the name `artifact-clean-up`
- Set the expiration - I chose 7 days as I am doing this one-off
  (The 1 day artifact retention period I set won't make this a problem again.)
- Describe the PAT:
  > A one-off PAT for GitHub Actions workflow artifact mass-removal
- Set repository access to the repository(/ies) with the problematic workflow(s)
- Set the repository permissions to Worfklows: read and write
- Leave the account permissions at No access for all scopes

## 2. List all artifacts

Use the `per_page` query parameter to make sure to max out the GitHub API paging
and not waste the rate limit.

Use the `name` parameter if the artifacts have a consistent naming scheme to not
include unrelated artifacts (from other workflows one might not wish to target)
in the response.

```bash
OWNER=
REPO=
PAT=
NAME=
curl -H "Authorization: Bearer $PAT https://api.github.com/repos/$OWNER/$REPO/actions/artifacts?per_page=100&name=NAME
```

## 3. Loop over the artifacts and call the deletion endpoint for each

This will cut through the rate limit a lot and if the number of artifacts is
significant, it might be advisable to do this in several different sessions.

TODO: Finish this once I have the organization PAT set up
