import { IExecuteFunctions, type INodeType, type INodeTypeDescription, NodeOutput } from 'n8n-workflow';
export declare class BrowcallGate implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<NodeOutput>;
}
