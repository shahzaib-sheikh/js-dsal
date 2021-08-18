export class AhoCorasick {
    rootNode: Node;

    constructor(keys?: Array<string>) {
        this.rootNode = new Node();
        this.build(keys || []);
    }


    public build(keys: Array<string>) {
        keys.map(key => this.addKey(key));
        this.buildFailed();
    }

    public addKey(key: string): this {
        let node = this.rootNode;
        for (let i = 0; i < key.length; i++) {
            const char = key[i];
            let interEdge = node.getChild(char);
            let interNode = interEdge?.to || new Node();;
            if (interEdge === null) {
                interEdge = new Edge(node, interNode, char);
                node.addChild(char, interEdge);
            }
            node = interNode;
        }
        node.addOutput(key);
        return this;
    }

    public match(haystack: string) {
        let occurenceMap: {
            [key: string]: number[]
        } = {};

        let node = this.rootNode;
        for (let i = 0; i < haystack.length; i++) {
            let edge = node.getChild(haystack[i]);

            while (node != this.rootNode && !edge) {
                node = node.failed?.to || this.rootNode;
                edge = node.getChild(haystack[i]);
            }

            if (edge) {
                node = edge.to;

                node.getOuput().map(x =>
                    (occurenceMap[x] === undefined) ?
                        (occurenceMap[x] = [i - x.length + 1]) :
                        occurenceMap[x].push(i - x.length + 1)
                );

                continue;
            }
        }
        return occurenceMap;
    }


    public buildFailed() {
        const queue: Array<Edge<string>> = [];
        this.rootNode.failed = new Edge<string>(this.rootNode, this.rootNode);
        this.rootNode.getChildrens().map(edge => queue.push(edge) && (edge.to.failed = new Edge(edge.to, this.rootNode)))

        while (true) {
            let edge = queue.shift();
            if (!edge) {
                break;
            }

            let node = edge.to;

            node.getChildrens().map(edge => {
                let char = edge.data || "";
                let childNode = edge.to;

                let itrNode = node.failed
                while (true) {
                    if (!itrNode || !itrNode.to.failed) {
                        childNode.failed = new Edge<string>(childNode, this.rootNode);
                        break;
                    }

                    let closestAncesstor = itrNode.to.getChild(char);
                    if (closestAncesstor) {
                        childNode.failed = new Edge<string>(childNode, closestAncesstor.to);
                        closestAncesstor.to.getOuput().map(x => childNode.addOutput(x))
                        break;
                    }else if(!closestAncesstor && itrNode.to === this.rootNode) {
                        childNode.failed = new Edge<string>(childNode, this.rootNode);
                        break;
                    }

                    itrNode = itrNode.to.failed;
                }
                queue.push(edge);
            });
        }
    }
}

class Node {
    output: Array<string> = [];
    failed?: Edge<string>;
    childrens: {
        [key: string]: Edge<string>
    } = {};

    addOutput(output: string): this {
        this.output.push(output);
        return this;
    }

    getOuput(): Array<string> {
        return this.output;
    }

    getChildrens(): Array<Edge<string>> {
        return Object.keys(this.childrens).map(key => this.childrens[key]);
    }

    addChild(key: string, edge: Edge<string>): this {
        if (this.childrens[key] !== undefined) {
            console.warn("replacing children use replaceChild instead!")
        }
        return this.replaceChild(key, edge);
    }
    getChild(key: string): Edge<string> | null {
        if (this.childrens[key] === undefined) {
            return null;
        }
        return this.childrens[key];
    }

    replaceChild(key: string, edge: Edge<string>): this {
        this.childrens[key] = edge;
        return this;
    }
}

class Edge<T> {
    from: Node;
    to: Node;
    data?: T;

    constructor(from: Node, to: Node, data?: T) {
        this.from = from;
        this.to = to;
        this.data = data;
    }

    setData(data: T): this {
        this.data = data
        return this;
    }
}