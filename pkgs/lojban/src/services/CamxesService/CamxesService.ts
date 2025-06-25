/* eslint-disable @typescript-eslint/no-unused-vars */
import { singleton } from "@hades-ts/hades";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { camxes } from "camxes";

type Parens = { left: string; right: string };

type SimpleNode = readonly [string, ParseNode];

type SpreadNode = readonly [string, ...ParseNode[]];

type ListNode = readonly [string, ParseNode[]];

type ParseNode = SimpleNode | SpreadNode | ListNode;

function isSimpleNode(node: ParseNode): node is SimpleNode {
    return (
        Array.isArray(node) &&
        typeof node[0] === "string" &&
        node.length === 2 &&
        Array.isArray(node[1]) &&
        typeof node[1][0] === "string"
    );
}

function isSpreadNode(node: ParseNode): node is SpreadNode {
    return (
        Array.isArray(node) && typeof node[0] === "string" && node.length > 2
    );
}

function isListNode(node: ParseNode): node is ListNode {
    return (
        Array.isArray(node) &&
        typeof node[0] === "string" &&
        node.length === 2 &&
        Array.isArray(node[1]) &&
        node[1].every((child) => Array.isArray(child))
    );
}

function isNodeArray(node: any): node is ParseNode[] {
    return Array.isArray(node) && node.every((child) => Array.isArray(child));
}

@singleton(CamxesService)
export class CamxesService {
    public getParse(word: string) {
        const parse = camxes.parse(word, undefined);
        return this.convertParse(parse);
    }

    protected convertSelbriArray(nodes: ParseNode[]): string {
        const last = nodes.pop();
        const converted = this.convertParse(last);

        if (nodes.length === 0) {
            return converted;
        }

        const rest = this.convertSelbriArray(nodes);

        return `<${rest} ${converted}>`;
    }

    protected convertSimpleNode(
        node: SimpleNode,
        render: (value: string) => string = (value) => value,
    ) {
        const [_, child] = node;
        const result: string = this.convertParse(child);
        return render(result);
    }

    protected convertSpreadNode(
        node: SpreadNode,
        merge: (...args: string[]) => string = (...args) => args.join(" "),
    ) {
        const [_, ...children] = node;
        const results: string[] = children.map((child) =>
            this.convertParse(child),
        );
        return merge(...results);
    }

    protected convertListNode(
        node: ListNode,
        merge: (...args: string[]) => string = (...args) => args.join(" "),
    ) {
        const [_, children] = node;
        const results: string[] = children.map((child) =>
            this.convertParse(child),
        );
        return merge(...results);
    }

    protected convertAtom(
        node: ListNode,
        render: (values: string[]) => string = (values) => values.join(" "),
    ) {
        const [_, children] = node;
        const results: string[] = children.map((child) =>
            this.convertParse(child),
        );
        return render(results);
    }

    protected bridiTerm(node: ParseNode) {
        return this.convertSpreadNode(
            node as SpreadNode,
            (...vals) => `{ ${vals.join(" ")} }`,
        );
    }

    protected parenCmavo(node: ParseNode) {
        return this.convertAtom(node as ListNode);
    }

    protected convertSumti(node: SpreadNode): string {
        // can this just use convertSpreadNode?
        const [_, ...children] = node;
        if (children.length === 3) {
            const [pre, mid, post] = children;
            return `[${this.convertParse(pre)} ${this.convertParse(mid)} ${this.convertParse(post)}]`;
        }

        if (children.length === 2) {
            return this.convertSpreadNode(
                node,
                (...vals) => `[${vals.join(" ")}]`,
            );
        }

        return this.convertParse(children[0]);
    }

    protected convertParse(
        node: ParseNode | undefined,
        parens?: Parens,
    ): string {
        if (node === undefined) {
            return "";
        }

        const kind = node[0];

        if (typeof kind === "string") {
            console.log(`Parsing: ${kind}`);

            switch (true) {
                case kind === "text":
                case kind === "subsentence":
                    return this.bridiTerm(node);

                case kind === "BRIVLA":
                    console.log(JSON.stringify(node, null, 2));
                    console.log(`Found brivla: ${node[1][1]}`);
                    return `<${node[1][1]}>`;

                case kind.startsWith("selbri"):
                    return this.convertSelbriArray(
                        node.slice(1) as ParseNode[],
                    );

                case kind.startsWith("sumti"):
                    return this.convertSumti(node as SpreadNode);

                case kind.startsWith("tanru"):
                    // return this.convertSpreadNode(node as SpreadNode, (...vals) => `<${vals.join(" ")}>`)
                    return this.convertSelbriArray(
                        node.slice(1) as ParseNode[],
                    );

                case ["KOhA_clause"].includes(kind):
                    return this.convertAtom(
                        node as ListNode,
                        (...vals) => `[${vals.join(" ")}]`,
                    );

                case [
                    "UI_clause",
                    "KOhA_clause",
                    "LE_clause",
                    "KU_clause",
                    "BE_clause",
                    "GOI_clause",
                    "SE_clause",
                    "NU_clause",
                    "JOI_clause",
                ].includes(kind):
                    return this.parenCmavo(node);
            }

            if (node.length === 2 && typeof node[1] === "string") {
                return node[1];
            }

            if (isSimpleNode(node)) {
                console.log(`${kind} is a simple node`);
                return this.convertSimpleNode(node);
            }

            if (isSpreadNode(node)) {
                console.log(`${kind} is a spread node`);
                return this.convertSpreadNode(node);
            }

            if (isListNode(node)) {
                console.log(`${kind} is an array node`);
                return this.convertListNode(node);
            }
        }

        if (node.length === 1) {
            console.log("Found pure array node.");
            const [first, ...rest] = node[0] as unknown as ParseNode[];
            console.log("First");
            console.log(JSON.stringify(first, null, 2));
            const firstKind = first![0];
            if (firstKind === "gihek") {
                console.log("Found gihek!");
                const gihek = this.convertParse(first);
                const others = rest.map((child) => this.convertParse(child));
                return `${gihek} ( ${others.join(" ")} )`;
            }
        }

        if (isNodeArray(node)) {
            return (node as ParseNode[])
                .map((child) => this.convertParse(child))
                .join(" ");
        }

        console.log(`Defaulted on ${kind}.`);
        console.log("Rest:");
        console.log(JSON.stringify(node), null, 2);
        return "";
    }
}
