import type React from "react";

import styles from "./styles.module.scss";

type FeatureItem = {
    title: string;
    key: number;
    url: string;
    description: React.JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: "Easy to Use",
        key: 1,
        url: "img/boon_codex.png",
        description: <>Designed from the ground up to streamline bot design.</>,
    },
    {
        title: "Scales with your Project",
        key: 2,
        url: "img/boon_heart.png",
        description: (
            <>As your project grows, you don't need to change your approach.</>
        ),
    },
    {
        title: "Promotes Clean Architecture",
        key: 3,
        url: "img/boon_gemstone.png",
        description: (
            <>
                Automatic dependency management lets you focus on your bot's
                business logic.
            </>
        ),
    },
];

function Feature({ title, url, description }: FeatureItem) {
    return (
        <div className={styles.feature}>
            <div className="text--center">
                {/** biome-ignore lint/a11y/useAltText: TODO: create feature image components with alt text pre-supplied*/}
                <img className={styles.featureSvg} src={url} />
            </div>
            <div className="text--center padding-horiz--sm">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): React.JSX.Element {
    return (
        <section className={styles.features}>
            {FeatureList.map((props, _idx) => (
                <Feature key={props.key} {...props} />
            ))}
        </section>
    );
}
