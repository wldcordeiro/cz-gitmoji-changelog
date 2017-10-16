const wrap = require("word-wrap");
const map = require("lodash.map");
const longest = require("longest");
const rightPad = require("right-pad");

const lengthWarning = '\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n'

function engine(options) {
  const types = options.types;
  const length = longest(Object.keys(types)).length + 1;
  const choices = map(types, (type, key) => ({
    name: `${rightPad(`${key}:`, length)} ${type.description}`,
    value: key,
  }));

  return {
    prompter(cz, commit) {
       console.log(lengthWarning);
       cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Select the type of change that you\'re committing:',
          choices: choices
        },
        {
          type: 'input',
          name: 'subject',
          message: 'Write a short, imperative tense description of the change:\n'
        },
        {
          type: 'input',
          name: 'body',
          message: 'Provide a longer description of the change:\n'
        },
        {
          type: 'input',
          name: 'breaking',
          message: 'List any breaking changes:\n'
        },
        {
          type: 'input',
          name: 'issues',
          message: 'List any issues closed by this change:\n'
        },
      ]).then(({ type, subject, body, breaking, issues }) => {
        const maxWidth = 100;
        const wrapOptions = {
          trim: true,
          newLine: '\n',
          index: '',
          width: maxWidth,
        };
        const head = `${type}: ${subject.trim()}`.slice(0, maxWidth);
        const bodyContent = wrap(body, wrapOptions);

        let breakingContent = '';
        if (breaking.trim()) {
          const replaced = breaking.replace(/^BREAKING CHANGE: /, '')
          breakingContent =  wrap(`BREAKING CHANGE: ${replaced}`, wrapOptions);
        }
        const issuesContent = wrap(issues, wrapOptions);
        const footer = [breakingContent, issuesContent]
          .filter(i => i)
          .join('\n\n');
        commit(`${head}\n\n${bodyContent}\n\n${footer}`);
      });
    }
  }
}

module.exports = engine;
