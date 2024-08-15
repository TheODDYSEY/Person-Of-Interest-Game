#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import cliProgress from 'cli-progress';
import { execSync } from 'child_process';

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
function finishGame() {
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
      description: 'Shaw goes undercover to investigate a powerful criminal organization.',
      prompt: '🕵️‍♀️ You need to infiltrate a criminal organization. How do you approach this?\n',
      choices: [
        'Use a cover identity to blend in 🕵️‍♀️',
        'Gather intelligence from insiders 🕵️‍♀️',
        'Perform a direct assault on their base 🚨',
        'Use surveillance to monitor their activities 📹',
      ],
      correctAnswer: 'Use a cover identity to blend in 🕵️‍♀️'
    }),
    async () => mission(3, 2, {
      description: 'Shaw is dealing with personal issues while on a mission.',
      prompt: '💔 Personal problems are affecting your mission. How do you handle it?\n',
      choices: [
        'Confront the challenge directly 💪',
        'Seek help from a trusted ally 🕵️‍♀️',
        'Set aside personal issues for now and focus on the mission 🎯',
        'Reevaluate your priorities and make a decision 🔍',
      ],
      correctAnswer: 'Set aside personal issues for now and focus on the mission 🎯'
    }),
    async () => mission(3, 3, {
      description: 'Shaw must track down a missing person.',
      prompt: '🕵️‍♀️ A crucial person is missing. What is your plan to find them?\n',
      choices: [
        'Use all available resources to track them down 🔍',
        'Interview people who might know their whereabouts 🗣️',
        'Analyze recent activities and patterns 📊',
        'Wait for them to make contact on their own ⏳',
      ],
      correctAnswer: 'Use all available resources to track them down 🔍'
    }),
    async () => mission(3, 4, {
      description: 'Shaw needs to make a tough decision during a high-stakes mission.',
      prompt: '🔥 You’re in a high-stakes situation. What decision do you make?\n',
      choices: [
        'Prioritize the mission objectives over personal safety 🎯',
        'Ensure the safety of your team members first 🛡️',
        'Seek a compromise that minimizes risks ⚖️',
        'Abort the mission if the risks are too high 🚫',
      ],
      correctAnswer: 'Prioritize the mission objectives over personal safety 🎯'
    }),
  ],
  'Root': [
    async () => mission(4, 1, {
      description: 'Root uses her skills to extract vital information.',
      prompt: '💻 You need crucial data from a secured system. What is your approach?\n',
      choices: [
        'Hack into the system discreetly 🔓',
        'Use social engineering to gain access 🕵️‍♀️',
        'Collaborate with an insider 🧩',
        'Try to obtain the data through legal means 📜',
      ],
      correctAnswer: 'Hack into the system discreetly 🔓'
    }),
    async () => mission(4, 2, {
      description: 'Root works on a plan to enhance the Machine’s capabilities.',
      prompt: '⚙️ You need to enhance the Machine’s functionality. What do you do?\n',
      choices: [
        'Implement new algorithms and updates 💻',
        'Upgrade hardware components 🖥️',
        'Increase security measures 🔒',
        'Consult with Finch for additional input 💬',
      ],
      correctAnswer: 'Implement new algorithms and updates 💻'
    }),
    async () => mission(4, 3, {
      description: 'Root attempts to sabotage a rival’s operation.',
      prompt: '💣 You need to disrupt a rival’s plans. What is your approach?\n',
      choices: [
        'Infiltrate their operation and gather intel 🕵️‍♀️',
        'Disrupt their communications 📞',
        'Deploy a counter-operation to sabotage their efforts 💣',
        'Leak false information to mislead them 📰',
      ],
      correctAnswer: 'Deploy a counter-operation to sabotage their efforts 💣'
    }),
    async () => mission(4, 4, {
      description: 'Root plans an elaborate scheme to protect the Machine.',
      prompt: '🛡️ You need to devise a plan to safeguard the Machine from imminent threats. How do you proceed?\n',
      choices: [
        'Create a multi-layered security protocol 🔐',
        'Develop a backup system to secure the Machine 🖥️',
        'Implement new privacy measures and encryption 🔒',
        'Establish a decoy operation to mislead potential threats 🎭',
      ],
      correctAnswer: 'Create a multi-layered security protocol 🔐'
    }),
  ],
};

// Main mission function
async function mission(season, missionNumber, { description, prompt, choices, correctAnswer }) {
  console.log(`\nSeason ${season}: ${description}`);
  
  // Randomize choices for the mission
  const randomizedChoices = [...choices];
  randomizeChoices(randomizedChoices);
  
  const answers = await inquirer.prompt({
    name: `season${season}_mission${missionNumber}`,
    type: 'list',
    message: prompt,
    choices: randomizedChoices,
  });

  const isCorrect = answers[`season${season}_mission${missionNumber}`] === correctAnswer;
  await handleAnswer(isCorrect, `Season ${season}`, `Mission ${missionNumber}`);
  
  // Move to next mission if correct
  if (isCorrect) {
    missionIndex++;
    if (missionIndex < missions[character].length) {
      displayProgress();
      await missions[character][missionIndex]();
    } else {
      finishGame();
    }
  }
}

// Initialize progress bar
progressBar = new cliProgress.SingleBar({
  format: 'Progress |' + '{bar}' + '| {percentage}% | {value}/{total} Missions',
  hideCursor: true,
}, cliProgress.Presets.shades_classic);

// Run the game
async function main() {
  console.clear();
  progressBar.start(16, 0); // Adjust total steps based on missions
  await welcome();
  await askName();
  await chooseCharacter();
  missionIndex = 0; // Reset mission index
  for (const missionFn of missions[character]) {
    await missionFn();
  }
}

main();
