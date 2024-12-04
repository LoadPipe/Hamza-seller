# Hamza Server

### Setup Quick Start

```
cd ./admin-server
yarn install
docker-compose up -d
yarn setup-0
# WAIT for the server to start listening on port 9000
yarn setup-1
# at this point, you can shut the server down if you wish
```

## PR Procedures

### PR Creator

1. Give the PR a title: [JIRA-ID-ALL-CAPS]: Description
   EXAMPLES: "HAMSL-24: Fixed Build Error", "HAMSTR-118: Created Wallet Service"

2. Next, enter a list, as detailed as you want, of the changes in the PR (summarized)

3. Next, any other info (optional) that you think is important (optional)

4. Next, steps for the tester to follow, to basically test the workingness of the PR

5. Assign a Reviewer in the PR, in github

6. Move the task in Jira to IN REVIEW column

7. In Jira, add an Approver (same person from step 5)

### PR Reviewer

1. Reads PR text

2. Pulls branch

3. Builds server & client (to make sure no build errors)

4. Follows steps to test found in the PR

#### On Failure:

- request changes in PR (in github)
- ping the PR creator in discord to let them know

#### On Success:

- approve the PR
- merge the branch
- move Jira task to DONE
