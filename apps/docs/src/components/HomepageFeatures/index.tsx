import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

type FeatureItem = {
  title: string;
  url: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    url: 'img/boon_codex.png',
    description: (
      <>
        Designed from the ground up to streamline bot design.
      </>
    ),
  },
  {
    title: 'Scales with your Project',
    url: 'img/boon_heart.png',
    description: (
      <>
        As your project grows, you don't need to change your approach.
      </>
    ),
  },
  {
    title: 'Promotes Clean Architecture',
    url: 'img/boon_gemstone.png',
    description: (
      <>
        Automatic dependency management lets you focus on your bot's business logic.
      </>
    ),
  },
];

function Feature({ title, url, description }: FeatureItem) {
  return (
    <div className={styles.feature}>
      <div className="text--center">
        <img className={styles.featureSvg} src={url} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      {FeatureList.map((props, idx) => (
        <Feature key={idx} {...props} />
      ))}
    </section>
  );
}
