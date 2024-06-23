#!/usr/bin/env node
// Commander Reference: https://www.npmjs.com/package/commander#common-option-types-boolean-and-value
import { program } from "commander";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import packageJson from "../package.json";
import { createServer } from "vite";
import puppeteer from "puppeteer";

// Version & Program description
program
  .version(packageJson.version, "-v", "Output the version number")
  .description("Creates, updates, and deploys Mobot projects");

// Sync
program
  .command(`sync`)
  .description(`Syncs the current project to the .mobot_cache directory`)
  .action(async function () {
    const server = await createServer();
    await server.listen();
    const port = server.config.server.port;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const url = `http://localhost:${port}`;
    console.log("Opening the generated website:", url);
    await page.goto(url, {
      waitUntil: "networkidle0",
    });
    // Extract the configuration from the page
    const iacConfig = await page.evaluate(`window.iacConfig`);

    console.log("IAC Configuration:", iacConfig);

    // Process the configuration as needed
    // For example, deploy infrastructure, validate configuration, etc.

    await browser.close();
    process.exit(0);
  });

// Sync the current project to GitHub
const localSettingsPath = `${__dirname}/localSettings.json`;
program
  .command(`upgrade`)
  .aliases([`update`, `up`, `u`])
  .description(`Upgrades tke cli to the latest version`)
  .action(async function () {
    console.log(`Updating Mobot CLI...`);
    const oldVersion = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, `../package.json`), `utf-8`),
    ).version;
    const tag = fs.existsSync(localSettingsPath)
      ? JSON.parse(fs.readFileSync(localSettingsPath, `utf-8`)).tag
      : `latest`;
    execSync(`npm i -g mobot-cli@${tag}`);
    const newVersion = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, `../package.json`), `utf-8`),
    ).version;
    if (oldVersion === newVersion) {
      console.log(`Mobot CLI is already up to date`);
    } else {
      console.log(`Updated Mobot CLI to ${newVersion}`);
    }
  });

// Run this program
program.parse(process.argv);
