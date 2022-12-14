import { mkSection } from './utils';


export default async () => {
    return [
        require.resolve('../plugins/watch-config'),
        require.resolve('docusaurus-plugin-sass'),
        [require.resolve("@cmfcmf/docusaurus-search-local"),
        {
            indexPages: false,
            indexDocs: true,
            indexBlog: false,
        }],
        await mkSection('hades'),
        await mkSection('text-commands'),
        await mkSection('slash-commands'),
        await mkSection('bots'),
        await mkSection('guides'),
    ]
}