import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import styles from './index.module.scss';
import HomepageFeatures from '../components/HomepageFeatures';


function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <splash className={clsx('hero', styles.heroBanner)}>
      <div className={styles.container}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <h1 className={`hero__title ${styles.hero__title}`}>{siteConfig.title}</h1>
          <p className={`hero__subtitle ${styles.hero__subtitle}`}>{siteConfig.tagline}</p>
          <HomepageFeatures />
        </div>
      </div>
    </splash>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`@hades-ts/solid`}
      description="Build SOLID Discord bots.">
      <HomepageHeader />
    </Layout>
  );
}
