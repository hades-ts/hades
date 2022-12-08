import React from 'react';
import CodeBlock from '@site/src/theme/CodeBlock';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import styles from './index.module.scss';
import HomepageFeatures from '../components/HomepageFeatures';

const snippet = `@singleton()
export class BotService extends HadesBotService {

    @inject(ILogger) log: ILogger;

    async onReady() {
        this.log.info(
          \`Logged in as \${this.client.user.username}.\`
        );
    }

    async onMessage(message: Message) {
        const highlight = \`<@!\${this.client.user.id}>\`;
        if (message.content.startsWith(highlight)) {
            await message.reply('Hello!');
        }
    }
}`


function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={clsx(styles.heroBanner)}>
      <img src="/img/hades.png" />
      <div className={styles.container}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <h1 className={`hero__title ${styles.hero__title}`}>{siteConfig.title}</h1>
          <p className={`hero__subtitle ${styles.hero__subtitle}`}>{siteConfig.tagline}</p>
          <div className={styles.snippet}>
            <CodeBlock language="jsx">{snippet}</CodeBlock>
          </div>
          <HomepageFeatures />
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`@hades-ts/hades`}
      description="Build SOLID Discord bots.">
      <HomepageHeader />
    </Layout>
  );
}
