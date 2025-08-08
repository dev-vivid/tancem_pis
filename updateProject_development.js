const util = require("util");
const readline = require("readline");
const exec = util.promisify(require("child_process").exec);

const PROCESS_NAME = "TANCEM_PIS";
const PROJECT_NAME = "TANCEM PIS";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const confirmAction = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === "yes" || answer.toLowerCase() === "y");
    });
  });
};

async function runCommand(command, message) {
  console.log(`Step ${message}: ${command}`);
  const { stdout, stderr } = await exec(command);
  console.log(stdout);
  if (stderr) {
    console.error(stderr);
  }
}

(async function () {
  try {
    // Step 1: Kill pm2
    await runCommand(`sudo pm2 stop ${PROCESS_NAME}`, `1 - Stop ${PROJECT_NAME} in pm2`);

    // Step 2: Pull from git
    await runCommand("git pull", "2 - Pulling from git");

    // Step 3: NPM Install
    const shouldInstall = await confirmAction(
      'Step 3 - Do you want to run "npm install"? (yes/no): ',
    );

    if (shouldInstall) {
      await runCommand("npm install", "3 - Installing node modules");
    } else {
      console.log("npm installation skipped.");
    }

    rl.close();
    rl.removeAllListeners();

    // Step 4: Generate Prisma Schema
    await runCommand("npx prisma generate", "4 - Prisma Generate");

    // Step 5: Build js from ts
    await runCommand("tsc -p .", "5 - Building js from ts");

    // Step 6: Remove node_modules
    //      await runCommand('sudo rm -r node_modules', '6 - Removing the node_modules folder')

    // Step 7: Start pm2
    await runCommand(`sudo pm2 start ${PROCESS_NAME} `, `7 - Starting ${PROJECT_NAME} in` + " pm2");

    console.log("Automation complete!");
  } catch (err) {
    console.error("An error occurred:", err);
    // Stop executing further commands by throwing the error again
    throw err;
  }
})();
