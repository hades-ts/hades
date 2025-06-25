import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@site/src/theme/CodeBlock";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import HomepageFeatures from "../components/HomepageFeatures";
import styles from "./index.module.scss";

const snippet = `class BotService extends HadesBotService {

    @inject(ILogger) log: ILogger;

    async onReady() {
        this.log.info(
          \`Logged in as \${this.client.user.username}.\`
        );
    }

    async onMessage(msg: Message) {
        if (this.isHighlight(msg.content)))
            await msg.reply('Hello!');
    }
}`;

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <div className={clsx(styles.heroBanner)}>
            <img
                src="/img/hades.png"
                alt="Hades standing - staring accusingly with a papyrus scroll gripped in hand."
            />
            <div className={styles.container}>
                <h1 className={`hero__title ${styles.hero__title}`}>{siteConfig.title}</h1>
                <p className={`hero__subtitle ${styles.hero__subtitle}`}>{siteConfig.tagline}</p>
                <div className={styles.snippet}>
                    <CodeBlock language="jsx">{snippet}</CodeBlock>
                </div>
                <HomepageFeatures />
            </div>
        </div>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title={`${siteConfig.title}`} description="Discord bot framework built with Inversify and Discord.js.">
            <HomepageHeader />
        </Layout>
    );
}
