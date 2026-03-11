# OrangeHRM-Automation-Suite
This project demonstrates a robust UI automation framework for the OrangeHRM demo application using Playwright with TypeScript/JavaScript. It covers key HR functionalities including login, employee, leave management, and user admin. It supports cross-browser testing, parallel execution, and detailed test reports, showcasing test automation skills.

do NOT run playwright test directly from prompt. Always do "npm run test" which will use pre defined scripts of package json
npm run testscript -- admin --project=chromium 
(admin is the keyword match for testfile name. It can be multiple)
( 
  -- is special in npm scripts: it passes arguments from npm to the script. 
  Now we no longer dependent on this sequence in npx command "npx playwright test admin --config=config\playwright.config.ts --project=chromium"
  If you notice carefully, we have defined "playwright" as a command inside script. So, during executing we are combining that command with npm argument when whe say "npm run playwright --"
)