import { addFilter } from "@factor/tools"
import { writeConfig } from "@factor/cli/setup"
import inquirer from "inquirer"

const configFile = ".env"
const configVars = ["SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_HOST"]

const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST } = process.env

if (!SMTP_USERNAME || !SMTP_PASSWORD || !SMTP_HOST) {
  addFilter("setup-needed", _ => {
    const item = {
      title: "SMTP Email Credentials",
      value: "Needed for transactional emails (e.g. forgot password)",
      file: configFile,
      vars: configVars
    }

    return [..._, item]
  })
}

// CLI admin setup utility
addFilter("cli-add-setup", _ => {
  const setupItem = {
    name: "Email Setup - Transactional Email SMTP Info",
    value: "email",
    callback: async (): Promise<void> => {
      const questions = [
        {
          name: "SMTP_USERNAME",
          message: "What's Your SMTP Service Username?",
          type: "input",
          default: process.env.SMTP_USERNAME
        },
        {
          name: "SMTP_PASSWORD",
          message: "What's Your SMTP Service Password?",
          type: "input",
          default: process.env.SMTP_USERNAME
        },
        {
          name: "SMTP_HOST",
          message: "What's Your SMTP Service Host?",
          type: "input",
          default: process.env.SMTP_HOST
        }
      ]

      const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST } = await inquirer.prompt(questions)

      await writeConfig(".env", { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST })
    }
  }

  return [..._, setupItem]
})