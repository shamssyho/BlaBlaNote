import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type PricingTier = {
  name: string;
  price: string;
  description: string;
};

type MarketingConfig = {
  productName: string;
  positioning: {
    category: string;
    icp: string[];
    valueProposition: string;
  };
  features: string[];
  pricing: PricingTier[];
  faq: string[];
  seo: {
    titleVariants: string[];
    descriptionVariants: string[];
    keywordClusters: string[];
  };
  blog: {
    pillarPages: string[];
    titleIdeas: string[];
  };
};

function section(title: string, content: string) {
  return `## ${title}\n\n${content.trim()}\n`;
}

function list(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n');
}

function generateMarkdown(config: MarketingConfig) {
  const pricingTable = [
    '| Plan | Price | Description |',
    '| --- | --- | --- |',
    ...config.pricing.map(
      (tier) => `| ${tier.name} | ${tier.price} | ${tier.description} |`
    ),
  ].join('\n');

  return `# ${config.productName} Marketing Site Documentation

${section(
  'Positioning and ICP',
  `**Category:** ${config.positioning.category}\n\n**Value proposition:** ${config.positioning.valueProposition}\n\n**Ideal customer profile:**\n${list(config.positioning.icp)}`
)}
${section(
  'Landing Page Copy',
  `### Hero\n- Headline: Turn voice notes into searchable, shareable knowledge.\n- Subheadline: Record once, organize by project and tags, summarize, translate and share instantly.\n- Primary CTA: Start free\n- Secondary CTA: Watch demo\n\n### Benefits\n${list([
    'Capture ideas at conversation speed',
    'Transform audio into structured knowledge automatically',
    'Share outcomes across the channels teams already use',
    'Maintain control with privacy-first access and admin governance',
  ])}\n\n### Features\n${list(config.features)}\n\n### How it works\n${list([
    'Record or upload audio notes',
    'Attach notes to a project and assign personalized tags',
    'Generate summary or translation on demand',
    'Share via email, WhatsApp, Notion, or secure public links',
  ])}\n\n### Pricing\n${pricingTable}\n\n### FAQ\n${list(config.faq)}`
)}
${section(
  'Use Cases',
  list([
    'Founder daily voice journal transformed into actionable priorities',
    'Customer call debriefs summarized and shared to stakeholders',
    'Field teams sending WhatsApp updates converted into team knowledge',
    'Content teams translating idea banks for multilingual publishing',
  ])
)}
${section(
  'SEO Metadata',
  `### Title variants\n${list(config.seo.titleVariants)}\n\n### Description variants\n${list(config.seo.descriptionVariants)}\n\n### Keyword clusters\n${list(config.seo.keywordClusters)}`
)}
${section(
  'Blog Content Strategy',
  `### Pillar pages\n${list(config.blog.pillarPages)}\n\n### Suggested titles\n${list(config.blog.titleIdeas)}`
)}
`;
}

function main() {
  const root = process.cwd();
  const configPath = join(root, 'docs', 'marketing', 'marketing.config.json');
  const targetDir = join(root, 'docs', 'marketing');
  const targetPath = join(targetDir, 'MARKETING_SITE.md');

  const config = JSON.parse(
    readFileSync(configPath, 'utf-8')
  ) as MarketingConfig;
  const markdown = generateMarkdown(config);

  mkdirSync(targetDir, { recursive: true });
  writeFileSync(targetPath, markdown, 'utf-8');
}

main();
