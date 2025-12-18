const { execSync } = require("child_process");

const name = process.argv[2];
if (!name) {
  console.error("Укажи имя миграции");
  process.exit(1);
}

const cmd = `ts-node ./node_modules/typeorm/cli.js migration:generate src/infrastructure/migrations/${name} -d src/data-source.ts`;
execSync(cmd, { stdio: "inherit" });
