import { mkMenuItem } from './utils';

export default [
    mkMenuItem('hades'),
    mkMenuItem('text-commands'),
    mkMenuItem('slash-commands'),
    mkMenuItem('bots'),
    mkMenuItem('guides'),
    {
        to: `/blog`,
        position: 'right',
        label: 'blog',
    },
    {
        href: 'https://github.com/hades-ts/hades',
        position: 'right',
        className: 'header-github-link',
        'aria-label': 'GitHub repository',
    },
]