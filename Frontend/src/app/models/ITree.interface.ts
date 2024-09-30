export interface ITree {
    parentID: number,
    nodeID: number,
    path: string,
    level: number,
    properties: ITree[];
}
