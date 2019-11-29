require('dotenv').config();

const fs = require('fs');
const {sep} = require('path');
const ora = require('ora');
const chalk = require('chalk');
const colourise = require('json-colorizer');
const PromiseQueue = require('promise-queue');
const got = require('got');
const get = require('lodash.get');

class Seeder {
  async run(path = __dirname) {
    const entries = Object.entries(this.parsePath(path.replace(new RegExp(`${sep}$`), '')));

    if (entries.length === 0) {
      return this.error('The given path must be a .json file or a directory containing at least one .json file');
    }

    entries.sort(([a], [b]) => a === 'assets' ? 1 : b === 'assets' ? -1 : 0);

    this.spinner = ora({
      text: 'Seeding...',
      stream: process.stdout,
    }).start();

    const typeCounts = {};
    const queuedPromises = [];
    const responses = {};
    const queue = new PromiseQueue(1, Infinity);

    entries.forEach(([endpoint, data]) => {
      (Array.isArray(data) ? data : [data]).forEach((datum, index) => {
        const {link, ...rest} = datum;

        queuedPromises.push(queue.add(() =>
          this.post(`/v1/${endpoint}`, rest)
            .then(response => {
              if (Object.hasOwnProperty.call(typeCounts, endpoint)) {
                typeCounts[endpoint]++;
              } else {
                responses[endpoint] = [];
                typeCounts[endpoint] = 1;
              }
              responses[endpoint].push(JSON.parse(response.body))
            })
            .catch(error => {
              this.spinner.stop();
              this.log(`Could not push an object to the ${chalk.dim(endpoint)} endpoint (${error.message}):`);
              this.spinner.start()
            })
        ));

        if (endpoint === 'assets' && link) {
          queuedPromises.push(queue.add(() => {
            const assetId = responses.assets[index].id;
            const productId = get(responses, link);

            return this.post(`/v1/products/${productId}/assets`, {
              assets: [{id: assetId}]
            })
          }))
        }
      });
    });

    await Promise.all(queuedPromises);

    const report = Object.entries(typeCounts);

    if (report.length === 0) {
      return this.spinner.fail('Could not seed any of the provided data');
    }

    this.spinner.succeed('Completed seeding');
    this.log('Added:');
    report.forEach(([endpoint, count]) => {
      this.log(`  ${chalk.bold(count)} ${endpoint}`);
    })
  }

  parsePath(path) {
    let stat;

    try {
      stat = fs.statSync(path);
    } catch (error) {
      this.error(`Could not access given path: ${chalk.dim(path)}`);
    }

    let additionalErrorInfo = '';

    try {
      if (stat.isDirectory()) {
        return this.parseDirectory(path);
      }
      if (stat.isFile()) {
        return this.parseFile(path);
      }
    } catch (error) {
      if (error.name === 'SyntaxError') {
        additionalErrorInfo = `JSON failed to compile with error: ${chalk.dim(error.message)}.`;
      }
    }

    this.error(`Could not parse the given path: ${chalk.dim(path)}. ${additionalErrorInfo}`);
    return this.exit(1);
  }

  parseDirectory(directory) {
    const files = fs.readdirSync(directory);

    const result = {};

    for (const file of files) {
      // Ignore dotfiles
      if (file.startsWith('.') || !file.endsWith('.json')) {
        continue;
      }

      Object.entries(this.parsePath(directory + sep + file)).forEach(([key, value]) => {
        if (Object.hasOwnProperty.call(result, key)) {
          result[key].push(...value);
        } else {
          result[key] = value;
        }
      });
    }

    return result;
  }

  parseFile(file) {
    const contents = JSON.parse(fs.readFileSync(file));

    if (Array.isArray(contents)) {
      const lastSeperator = file.lastIndexOf(sep);
      const endpoint = file.substring(lastSeperator > 0 ? lastSeperator + 1 : 0, file.length - 5);
      return {
        [endpoint]: contents,
      }
    }

    return contents
  }

  post(endpoint, payload) {
    const url = process.env.REACT_APP_COMMERCEJS_API_URL;
    const key = process.env.REACT_APP_COMMERCEJS_SECRET_KEY;

    if (!url || !key) {
      return this.error(`Required .env keys "${chalk.bold('REACT_APP_CHEC_API_URL')}" and/or ${chalk.bold('REACT_APP_CHEC_SECRET_KEY')} are missing`);
    }

    const headers = {
      'content-type': 'application/json',
      'x-authorization': key,
    };

    return got(`${url}/${endpoint}`, {
      method: 'post',
      body: JSON.stringify(payload),
      headers,
      retry: {
        retries: 0,
      },
    });
  }

  log(log) {
    console.log(log);
  }

  error(log) {
    this.spinner.stop();
    throw new Error(`⚠️  ${chalk.bgRed(` ${log} `)}`)
  }
}

(new Seeder()).run().catch(error => {
  console.log(error.message);
  process.exit(1);
});
