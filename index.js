#!/usr/bin/env node

// Use dynamic import for ES modules
const { createSpinner } = require('nanospinner');
const cliProgress = require('cli-progress');
const { execSync } = require('child_process');

// Game variables
let playerName;
let character;
let progressBar;
let missionIndex = 0;

// Helper functions
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

// Clear terminal
const clearTerminal = () => execSync('clear'); // Use 'cls' for Windows

// Game introduction
async function welcome() {
  const chalk = (await import('chalk')).default;
  const chalkAnimation = (await import('chalk-animation')).default;

  const rainbowTitle = chalkAnimation.rainbow(
    'Person of Interest: The Machine\'s Directive \n'
  );

  await sleep();
  rainbowTitle.stop();

  console.log(`
    ${chalk.bgBlue('WELCOME TO THE GAME')} 
    You are a member of a covert team using advanced technology to prevent crimes before they happen.
    Make crucial decisions and navigate through dangerous missions to shape the future of New York City.
    Remember, every choice you make influences the outcome. 🕵️‍♂️💻
  `);
}

// Handle answers and update progress
async function handleAnswer(isCorrect, season, mission) {
  const chalk = (await import('chalk')).default;
  const spinner = createSpinner('Processing your decision...').start();
  await sleep();

  if (isCorrect) {
    spinner.success({ text: `✅ Good job, ${playerName}. You made the right choice!` });
    progressBar.increment();
  } else {
    spinner.error({ text: `💀 Mission failed, ${playerName}. Try again!` });
    clearTerminal();
    console.log(chalk.red(`\n💔 You've lost, ${playerName}. Restarting the game... 💔`));
    await sleep();
    return restartGame(); // Restart the game
  }
}

// Ask player for their name
async function askName() {
  const inquirer = (await import('inquirer')).default;
  const answers = await inquirer.prompt({
    name: 'player_name',
    type: 'input',
    message: 'What is your name?',
    default() {
      return 'Agent';
    },
  });

  playerName = answers.player_name;
}

// Choose character
async function chooseCharacter() {
  const inquirer = (await import('inquirer')).default;
  const answers = await inquirer.prompt({
    name: 'character',
    type: 'list',
    message: 'Choose your character:',
    choices: [
      'John Reese: Former Special Forces operative 🕵️‍♂️',
      'Harold Finch: Reclusive billionaire and tech genius 💻',
      'Sameen Shaw: Former government operative with a tough demeanor 💪',
      'Root: Mysterious hacker with a deep connection to the Machine 🧠',
    ],
  });

  character = answers.character.split(':')[0].trim(); // Extract character name from choice
  console.log(`\nYou have chosen ${character}. Let\'s begin your mission!`);
}

// Display game progress
function displayProgress() {
  console.log(`\nCurrent Mission Progress: ${progressBar.value}/${progressBar.total}`);
}

// Finish the game
async function finishGame() {
  const chalk = (await import('chalk')).default;
  const figlet = (await import('figlet')).default;
  const gradient = (await import('gradient-string')).default;

  console.clear();
  figlet(`Congratulations, ${playerName}!\n`, (err, data) => {
    if (err) {
      console.error('Error generating banner');
      console.error(err);
      process.exit(1);
    }
    console.log(gradient.pastel.multiline(data) + '\n');

    console.log(
      chalk.green(
        `You have successfully completed the game. Your actions have influenced the fate of New York City and the future of the team. 🏆`
      )
    );
    progressBar.stop();
    process.exit(0);
  });
}

// Restart the game
async function restartGame() {
  await sleep(2000); // Brief delay before restarting
  await main(); // Restart the main game function
}

// Randomize choices
function randomizeChoices(choices) {
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
}

// Character-specific missions
const missions = {
  'John Reese': [
    async () => mission(1, 1, {
      description: 'Reese investigates a lead on a new threat in the city.',
      prompt: '🔍 A lead on a dangerous group emerges. What do you do?\n',
      choices: [
        'Investigate the lead immediately 🚔',
        'Set up surveillance and wait for more information 📹',
        'Alert local law enforcement 🚓',
        'Ignore the lead for now 🕵️‍♂️',
      ],
      correctAnswer: 'Investigate the lead immediately 🚔'
    }),
    async () => mission(1, 2, {
      description: 'Reese faces off against a dangerous adversary.',
      prompt: '💥 You encounter a known adversary. What is your strategy?\n',
      choices: [
        'Confront the adversary directly 💪',
        'Gather intelligence and plan a careful attack 🕵️‍♂️',
        'Seek help from allies 🤝',
        'Retreat and regroup 🏃‍♂️',
      ],
      correctAnswer: 'Gather intelligence and plan a careful attack 🕵️‍♂️'
    }),
    async () => mission(1, 3, {
      description: 'Reese uncovers a conspiracy.',
      prompt: '🕵️‍♂️ You find evidence of a conspiracy. What is your next move?\n',
      choices: [
        'Investigate further to uncover the plot 🕵️‍♂️',
        'Report the findings to the authorities 🗂️',
        'Confront the people involved 😡',
        'Destroy the evidence and leave it alone 🚫',
      ],
      correctAnswer: 'Investigate further to uncover the plot 🕵️‍♂️'
    }),
    async () => mission(1, 4, {
      description: 'Reese is tasked with rescuing a key witness.',
      prompt: '🚨 A witness is in danger. How do you proceed?\n',
      choices: [
        'Plan a covert rescue operation 🕵️‍♂️',
        'Alert the police and coordinate with them 🚓',
        'Attempt a direct rescue 🚨',
        'Gather more information before taking action 🕵️‍♂️',
      ],
      correctAnswer: 'Plan a covert rescue operation 🕵️‍♂️'
    }),
  ],
  'Harold Finch': [
    async () => mission(2, 1, {
      description: 'Finch works to protect the Machine from being discovered.',
      prompt: '🛡️ You need to secure a location for the Machine. What is your approach?\n',
      choices: [
        'Use advanced encryption to secure communications 🔐',
        'Relocate the Machine to a new secure location 🏢',
        'Employ additional security measures 🛡️',
        'Leave it as it is and monitor for threats 🕵️‍♂️',
      ],
      correctAnswer: 'Use advanced encryption to secure communications 🔐'
    }),
    async () => mission(2, 2, {
      description: 'Finch faces ethical dilemmas about the Machine’s use.',
      prompt: '⚖️ The Machine’s capabilities are questioned. How do you respond?\n',
      choices: [
        'Explain the benefits of the Machine 💬',
        'Restrict its use to essential operations only 🔒',
        'Seek external opinions on its use 🗣️',
        'Reevaluate the Machine’s capabilities 🔍',
      ],
      correctAnswer: 'Explain the benefits of the Machine 💬'
    }),
    async () => mission(2, 3, {
      description: 'Finch faces a cyber attack on his systems.',
      prompt: '💻 A hacker is attempting to breach your systems. How do you handle it?\n',
      choices: [
        'Deploy countermeasures to stop the attack 🛡️',
        'Identify and trace the hacker 🔍',
        'Isolate affected systems and analyze the breach 🕵️‍♂️',
        'Wait and see if the attack subsides on its own ⏳',
      ],
      correctAnswer: 'Deploy countermeasures to stop the attack 🛡️'
    }),
    async () => mission(2, 4, {
      description: 'Finch needs to recruit a new ally.',
      prompt: '🤝 You need to bring someone into your team. What is your strategy?\n',
      choices: [
        'Offer them a high-stakes mission 🎯',
        'Persuade them with a compelling argument 💬',
        'Provide evidence of the Machine’s capabilities 💻',
        'Gain their trust through small tasks 🕵️‍♂️',
      ],
      correctAnswer: 'Provide evidence of the Machine’s capabilities 💻'
    }),
  ],
  'Sameen Shaw': [
    async () => mission(3, 1, {
      description: 'Shaw is undercover in a hostile environment.',
      prompt: '🔍 You’re undercover and need to blend in. What is your approach?\n',
      choices: [
        'Use a false identity and blend in 👤',
        'Gather intel from informants 🗣️',
        'Directly confront the organization 😠',
        'Coordinate with law enforcement 🚓',
      ],
      correctAnswer: 'Use a false identity and blend in 👤'
    }),
    async () => mission(3, 2, {
      description: 'Shaw must negotiate with a dangerous contact.',
      prompt: '🗣️ You need to negotiate with a dangerous contact. What’s your approach?\n',
      choices: [
        'Be firm and assertive 💪',
        'Offer them something valuable 💎',
        'Attempt to manipulate their emotions 😈',
        'Seek a middle ground and compromise 🤝',
      ],
      correctAnswer: 'Be firm and assertive 💪'
    }),
    async () => mission(3, 3, {
      description: 'Shaw encounters a betrayal within her team.',
      prompt: '💔 One of your team members has betrayed you. What do you do?\n',
      choices: [
        'Confront them directly 😠',
        'Investigate the reasons behind the betrayal 🔍',
        'Remove them from the team immediately 🚫',
        'Seek reconciliation and understand their motives 🤝',
      ],
      correctAnswer: 'Investigate the reasons behind the betrayal 🔍'
    }),
    async () => mission(3, 4, {
      description: 'Shaw faces a moral dilemma during a high-stakes operation.',
      prompt: '⚖️ You are faced with a difficult decision during an operation. How do you handle it?\n',
      choices: [
        'Prioritize the mission objectives over personal morals 💼',
        'Balance mission success with ethical considerations ⚖️',
        'Seek advice from a trusted ally 🤝',
        'Abort the mission and reassess the situation 🛑',
      ],
      correctAnswer: 'Balance mission success with ethical considerations ⚖️'
    }),
  ],
  'Root': [
    async () => mission(4, 1, {
      description: 'Root uncovers a hidden agenda within the organization.',
      prompt: '🕵️‍♀️ You discover a hidden agenda. What is your course of action?\n',
      choices: [
        'Investigate further to uncover the truth 🔍',
        'Alert the highest authority 🗣️',
        'Confront the people involved 😡',
        'Keep the information to yourself for now 🤫',
      ],
      correctAnswer: 'Investigate further to uncover the truth 🔍'
    }),
    async () => mission(4, 2, {
      description: 'Root faces a challenge in decrypting sensitive data.',
      prompt: '💻 You need to decrypt sensitive data. What is your strategy?\n',
      choices: [
        'Use advanced decryption tools 🔐',
        'Seek help from an expert 🧠',
        'Attempt a manual decryption 🛠️',
        'Wait for a breakthrough from the Machine 🕵️‍♀️',
      ],
      correctAnswer: 'Use advanced decryption tools 🔐'
    }),
    async () => mission(4, 3, {
      description: 'Root must decode a cryptic message.',
      prompt: '🗝️ A cryptic message needs to be decoded. How do you proceed?\n',
      choices: [
        'Use pattern recognition techniques 🔍',
        'Consult with experts in cryptography 🧠',
        'Attempt to decode manually 🛠️',
        'Wait for further instructions from the Machine 🕵️‍♀️',
      ],
      correctAnswer: 'Use pattern recognition techniques 🔍'
    }),
    async () => mission(4, 4, {
      description: 'Root is tasked with recruiting a key ally.',
      prompt: '🤝 You need to recruit a key ally. What is your approach?\n',
      choices: [
        'Present compelling evidence of your cause 🗂️',
        'Offer them a significant reward 💎',
        'Build a personal relationship 🤝',
        'Demonstrate the benefits of joining you 💼',
      ],
      correctAnswer: 'Present compelling evidence of your cause 🗂️'
    }),
  ],
};

// Function to display mission information
async function mission(season, missionNumber, { description, prompt, choices, correctAnswer }) {
  clearTerminal();
  const chalk = (await import('chalk')).default;
  console.log(chalk.yellow.bold(`Season ${season} - Mission ${missionNumber}`));
  console.log(`\n${description}`);
  
  const inquirer = (await import('inquirer')).default;
  const answer = await inquirer.prompt({
    name: 'choice',
    type: 'list',
    message: prompt,
    choices: choices,
  });

  await handleAnswer(answer.choice === correctAnswer, season, missionNumber);
}

// Main game loop
async function main() {
  clearTerminal();
  await welcome();
  await askName();
  await chooseCharacter();

  // Initialize progress bar
  progressBar = new cliProgress.SingleBar({
    format: 'Progress |' + (await import('chalk')).default.green('{bar}') + '| {percentage}% | {value}/{total} Missions',
    hideCursor: true,
  }, cliProgress.Presets.shades_classic);

  // Set progress bar total
  progressBar.start(4, 0);

  // Game loop
  while (missionIndex < 4) {
    const currentCharacterMissions = missions[character];
    if (!currentCharacterMissions) {
      const chalk = (await import('chalk')).default;
      console.log(chalk.red(`\nCharacter ${character} not found.`));
      break;
    }

    // Execute mission for the current character
    await currentCharacterMissions[missionIndex]();
    displayProgress();
    missionIndex++;

    if (missionIndex === 4) {
      finishGame();
    }
  }
}

main();
