import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { dump } from 'js-yaml';
import 'dotenv/config';
import { AppModule } from '../../apps/api/src/app/app.module';
import { buildSwaggerDocument } from '../../apps/api/src/app/swagger';

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

function sortObject(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map((item) => sortObject(item));
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .reduce<JsonObject>((acc, key) => {
        acc[key] = sortObject((value as JsonObject)[key]);
        return acc;
      }, {});
  }

  return value;
}

async function exportOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const document = sortObject(buildSwaggerDocument(app)) as JsonObject;

  const targetDir = join(process.cwd(), 'docs', 'api');
  mkdirSync(targetDir, { recursive: true });

  writeFileSync(
    join(targetDir, 'openapi.json'),
    `${JSON.stringify(document, null, 2)}\n`,
    'utf-8'
  );

  writeFileSync(
    join(targetDir, 'openapi.yaml'),
    `${dump(document, {
      lineWidth: -1,
      noCompatMode: true,
      sortKeys: true,
    })}`,
    'utf-8'
  );

  await app.close();
}

exportOpenApi();
