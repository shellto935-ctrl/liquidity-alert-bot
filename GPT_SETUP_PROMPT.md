# Copy everything below the line into your AI assistant (one that has GitHub and Railway connected)

Fill in the blanks first:
- MY_GITHUB_USERNAME: ______________________
- NEW_REPO_NAME (pick anything, e.g. my-liquidity-alert-bot): ______________________

---

I want to self-host a free Telegram trading-alert bot. Please do this step by step:

1. Create a new repository under my GitHub account (`MY_GITHUB_USERNAME/NEW_REPO_NAME`), and copy all files and folder structure from this existing public repo into it, unchanged: https://github.com/shellto935-ctrl/liquidity-alert-bot
   (If you can fork it directly instead of copying files, that's fine too — either way I want a full independent copy under my own account.)

2. Create a new Railway project (any name) with one empty service.

3. Connect that service's source to my new GitHub repo, branch `main`, and trigger the first build. Tell me the build status (BUILDING/SUCCESS/FAILED) and, if it fails, the exact error from the build logs.

4. Once it builds successfully, set these environment variables on the service (I will give you the actual values separately, one at a time, for security — don't ask me to paste them all in one message):
   - TWELVEDATA_API_KEY
   - TELEGRAM_BOT_TOKEN
   - TELEGRAM_CHAT_ID
   - GEMINI_API_KEY
   - AI_AGENT_ENABLED=true
   - DRY_RUN=true

5. Restart the service so the variables load, and show me the deploy logs so I can confirm it started with `dryRun=true` and no errors.

6. Once I confirm it's working in test mode, I'll ask you to set `DRY_RUN=false` and restart again so it starts sending real Telegram messages.

Important: if any step needs a fresh build (I changed code) vs. just a restart (I only changed a variable), use the right one — redeploying with only a restart when the code changed will NOT pick up the new code, and rebuilding when only a variable changed is unnecessary. Confirm which one you're doing before you do it.
