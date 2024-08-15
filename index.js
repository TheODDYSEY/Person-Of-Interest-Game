#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

let playerName;
let character;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

const decisionTree = {
  mission1: 'Hack into the bank\'s security cameras',
  mission2: 'Follow the person',
  mission3: 'Set up surveillance at the suspected location',
  mission4: 'Track using surveillance cameras',
  mission5: 'Secure the exits',
  mission6: 'Use non-lethal force'
};

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    'Person of Interest Game \n'
  );

  await sleep();
  rainbowTitle.stop();

  console.log(`
    ${chalk.bgBlue('HOW TO PLAY')} 
    You are a member of the team trying to prevent crimes before they happen.
    Make the right choices to save lives and stop criminals.

  `);
}

async function handleAnswer(isCorrect, mission) {
  const spinner = createSpinner('Checking answer...').start();
  await sleep();

  if (isCorrect) {
    spinner.success({ text: `Nice work ${playerName}. You made the right decision!` });
    displayTree(mission);
  } else {
    spinner.error({ text: `💀💀💀 Mission failed, you lose ${playerName}!` });
    displayTree(mission);
    process.exit(1);
  }
}

async function askName() {
  const answers = await inquirer.prompt({
    name: 'player_name',
    type: 'input',
    message: 'What is your name?',
    default() {
      return 'Player';
    },
  });

  playerName = answers.player_name;
}

async function chooseCharacter() {
  const answers = await inquirer.prompt({
    name: 'character',
    type: 'list',
    message: 'Choose your character:',
    choices: [
      'John Reese',
      'Harold Finch',
      'Sameen Shaw',
      'Root',
    ],
  });

  character = answers.character;
}

function success() {
  console.clear();
  figlet(`Mission Accomplished, ${playerName}!\n`, (err, data) => {
    console.log(gradient.pastel.multiline(data) + '\n');

    console.log(
      chalk.green(
        `Great job! You successfully completed the mission.`
      )
    );
    process.exit(0);
  });
}

function displayTree(currentMission) {
  const missions = Object.keys(decisionTree);
  const completed = missions.slice(0, missions.indexOf(currentMission) + 1);
  const incomplete = missions.slice(missions.indexOf(currentMission) + 1);

  console.log('\nDecision Tree:');
  completed.forEach((mission) => {
    console.log(`${chalk.green('✔')} ${mission}: ${decisionTree[mission]}`);
  });

  incomplete.forEach((mission) => {
    console.log(`${chalk.red('✘')} ${mission}`);
  });

  console.log('\n');
}

async function mission1() {
  const answers = await inquirer.prompt({
    name: 'mission_1',
    type: 'list',
    message: 'A potential threat is identified at a local bank. What do you do?\n',
    choices: [
      'Investigate the bank discreetly',
      'Alert the police immediately',
      'Hack into the bank\'s security cameras',
      'Ignore the threat',
    ],
  });

  if (answers.mission_1 === 'Hack into the bank\'s security cameras') {
    await handleAnswer(true, 'mission1');
    return mission2();
  } else {
    await handleAnswer(false, 'mission1');
  }
}

async function mission2() {
  const answers = await inquirer.prompt({
    name: 'mission_2',
    type: 'list',
    message: 'A suspicious person is seen near a high-profile target. What\'s your next step?\n',
    choices: [
      'Follow the person',
      'Confront the person directly',
      'Alert the target',
      'Monitor from a distance',
    ],
  });

  if (answers.mission_2 === 'Follow the person') {
    await handleAnswer(true, 'mission2');
    return mission3();
  } else {
    await handleAnswer(false, 'mission2');
  }
}

async function mission3() {
  const answers = await inquirer.prompt({
    name: 'mission_3',
    type: 'list',
    message: `You intercepted a message about an imminent attack. What do you do?\n`,
    choices: [
      'Trace the source of the message',
      'Warn potential victims',
      'Set up surveillance at the suspected location',
      'Ignore it as a hoax',
    ],
  });

  if (answers.mission_3 === 'Set up surveillance at the suspected location') {
    await handleAnswer(true, 'mission3');
    return mission4();
  } else {
    await handleAnswer(false, 'mission3');
  }
}

async function mission4() {
  const answers = await inquirer.prompt({
    name: 'mission_4',
    type: 'list',
    message: 'The suspect is on the move. How do you proceed?\n',
    choices: [
      'Pursue on foot',
      'Call for backup',
      'Set up a roadblock',
      'Track using surveillance cameras',
    ],
  });

  if (answers.mission_4 === 'Track using surveillance cameras') {
    await handleAnswer(true, 'mission4');
    return mission5();
  } else {
    await handleAnswer(false, 'mission4');
  }
}

async function mission5() {
  const answers = await inquirer.prompt({
    name: 'mission_5',
    type: 'list',
    message: 'The suspect has entered a building. What\'s your next move?\n',
    choices: [
      'Enter the building alone',
      'Wait for backup',
      'Secure the exits',
      'Monitor from outside',
    ],
  });

  if (answers.mission_5 === 'Secure the exits') {
    await handleAnswer(true, 'mission5');
    return mission6();
  } else {
    await handleAnswer(false, 'mission5');
  }
}

async function mission6() {
  const answers = await inquirer.prompt({
    name: 'mission_6',
    type: 'list',
    message: 'The suspect is cornered but armed. How do you handle it?\n',
    choices: [
      'Negotiate',
      'Use non-lethal force',
      'Call for SWAT',
      'Wait it out',
    ],
  });

  if (answers.mission_6 === 'Use non-lethal force') {
    await handleAnswer(true, 'mission6');
    success();
  } else {
    await handleAnswer(false, 'mission6');
  }
}

// Run it with top-level await
console.clear();
await welcome();
await askName();
await chooseCharacter();
await mission1();
