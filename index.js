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
const clearTerminal = () => {
  const platform = process.platform;
  if (platform === 'win32') {
    execSync('cls');
  } else {
    execSync('clear');
  }
};

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
        'Approach them with a detailed plan 📋',
        'Offer them incentives and rewards 💰',
        'Build a relationship and earn their trust 🤝',
        'Use connections to persuade them 🗣️',
      ],
      correctAnswer: 'Build a relationship and earn their trust 🤝'
    }),
  ],
  'Sameen Shaw': [
    async () => mission(3, 1, {
      description: 'Shaw goes undercover to infiltrate a dangerous group.',
      prompt: '🕵️‍♀️ You need to blend in with a dangerous group. How do you proceed?\n',
      choices: [
        'Adopt their mannerisms and habits 🎭',
        'Gather intelligence while remaining distant 🔍',
        'Act confidently and gain their trust 💬',
        'Avoid direct interaction and gather intel from afar 🕵️‍♀️',
      ],
      correctAnswer: 'Act confidently and gain their trust 💬'
    }),
    async () => mission(3, 2, {
      description: 'Shaw must handle a hostage situation.',
      prompt: '🚨 You’re faced with a hostage crisis. What’s your plan?\n',
      choices: [
        'Negotiate with the captors 🗣️',
        'Attempt a rescue operation 💪',
        'Provide tactical support to responders 🛡️',
        'Wait for more information before acting ⏳',
      ],
      correctAnswer: 'Negotiate with the captors 🗣️'
    }),
    async () => mission(3, 3, {
      description: 'Shaw uncovers a corruption scandal.',
      prompt: '📉 You discover a major corruption scandal. What is your next step?\n',
      choices: [
        'Report it to the authorities 🗂️',
        'Investigate further to uncover the full extent 🔍',
        'Leak the information to the media 📰',
        'Confront the individuals involved directly 😡',
      ],
      correctAnswer: 'Investigate further to uncover the full extent 🔍'
    }),
    async () => mission(3, 4, {
      description: 'Shaw is assigned to protect a key witness.',
      prompt: '🔒 You need to protect a key witness from danger. How do you approach it?\n',
      choices: [
        'Enhance their security with surveillance 🕵️‍♀️',
        'Arrange safe transport and relocation 🚐',
        'Work with local authorities for protection 🚓',
        'Isolate them in a secure location 🔐',
      ],
      correctAnswer: 'Arrange safe transport and relocation 🚐'
    }),
  ],
  'Root': [
    async () => mission(4, 1, {
      description: 'Root must handle a sensitive data breach.',
      prompt: '📉 A data breach has occurred. What is your response?\n',
      choices: [
        'Contain and neutralize the breach immediately 🔒',
        'Analyze the breach to understand its origin 🔍',
        'Alert the affected parties and work on mitigation 🛡️',
        'Review and strengthen security measures 🔐',
      ],
      correctAnswer: 'Contain and neutralize the breach immediately 🔒'
    }),
    async () => mission(4, 2, {
      description: 'Root needs to recruit a hacker for a mission.',
      prompt: '🖥️ You need to recruit a skilled hacker. What is your approach?\n',
      choices: [
        'Offer a lucrative deal 💰',
        'Build rapport and trust 🤝',
        'Leverage existing connections 🔗',
        'Demonstrate the importance of the mission 🗣️',
      ],
      correctAnswer: 'Build rapport and trust 🤝'
    }),
    async () => mission(4, 3, {
      description: 'Root faces a moral dilemma involving surveillance.',
      prompt: '🔍 You need to make a decision about extensive surveillance. What do you do?\n',
      choices: [
        'Implement it for national security 🛡️',
        'Consider the ethical implications 🗣️',
        'Seek consensus from key stakeholders 🤝',
        'Limit the scope and monitor closely 📊',
      ],
      correctAnswer: 'Consider the ethical implications 🗣️'
    }),
    async () => mission(4, 4, {
      description: 'Root is tasked with analyzing a large dataset.',
      prompt: '📊 You need to analyze a vast amount of data. How do you approach it?\n',
      choices: [
        'Use advanced data mining techniques 📈',
        'Segment the data and analyze in parts 🗂️',
        'Employ machine learning algorithms 🤖',
        'Work with a team of analysts 🧑‍💻',
      ],
      correctAnswer: 'Use advanced data mining techniques 📈'
    }),
  ],
};

// Main function
async function main() {
  clearTerminal();
  await welcome();
  await askName();
  await chooseCharacter();
  
  // Initialize progress bar
  progressBar = new cliProgress.SingleBar({
    format: 'Progress |{bar}| {percentage}% || {value}/{total} Missions',
    hideCursor: true,
  }, cliProgress.Presets.shades_classic);

  // Set total missions based on character
  const totalMissions = missions[character]?.length || 0;
  progressBar.start(totalMissions, 0);

  while (missionIndex < totalMissions) {
    clearTerminal();
    await missions[character][missionIndex]();
    displayProgress();
    missionIndex++;
  }

  await finishGame();
}

// Start the game
main().catch(console.error);
