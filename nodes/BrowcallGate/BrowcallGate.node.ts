import {
  IExecuteFunctions,
  NodeConnectionTypes,
  type INodeType,
  type INodeTypeDescription,
  INodeExecutionData,
  NodeOutput,
  IHttpRequestMethods,
  INodeProperties,
  INodePropertyOptions,
} from 'n8n-workflow';
import { messageDescription } from './resources/message';

export class BrowcallGate implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Browcall Gate',
    name: 'browcallGate',
    icon: {
      light: 'file:browgate.svg',
      dark: 'file:browgate.dark.svg',
    },
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Browcall Gate API With socket connection',
    defaults: {
      name: 'Browcall Gate',
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [],
    requestDefaults: {
      baseURL: 'http://localhost:8766/v1',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        default: 'http://localhost:8766/v1',
        description: 'The base URL of the Browcall Gate API',
        required: true,
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Auto Message',
            value: 'message',
          },
        ],
        default: 'message',
      },
      ...messageDescription,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<NodeOutput> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;
        const name = this.getNodeParameter('name', i) as string;
        const format = this.getNodeParameter('format', i) as string;
        const baseUrlInput = this.getNodeParameter('baseUrl', i) as string;

        // Get operation configuration
        let properties: INodeProperties[] = [];
        if (resource === 'message') {
          properties = messageDescription;
        }
        const opField = properties.find((d) => d.name === 'operation');
        const opConfig = opField?.options?.find(
          (o) => (o as INodePropertyOptions).value === operation
        ) as INodePropertyOptions | undefined;

        // Extract routing information from the operation configuration
        const methodFromConfig = opConfig?.routing?.request?.method?.toUpperCase() || 'POST';
        const method = (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].includes(methodFromConfig)
          ? methodFromConfig
          : 'POST') as IHttpRequestMethods;

        const urlPath = opConfig?.routing?.request?.url || 'chat/completions';
        
        const cleanBase = baseUrlInput.replace(/\/+$/, '');
        const cleanPath = urlPath.replace(/^\/+/, '');

        // Ensure we don't duplicate /v1 if it's present in both baseURL and urlPath
        const finalURL = (cleanPath.startsWith('v1/') && cleanBase.endsWith('/v1'))
          ? `${cleanBase.replace(/\/v1$/, '')}/${cleanPath}`
          : `${cleanBase}/${cleanPath}`;


        const body = {
          messages: [{ role: 'user', content: name }],
          outputFormat: format,
        };

        const responseData = await this.helpers.httpRequest({
          method,
          url: finalURL,
          body,
          json: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });


        returnData.push({ json: responseData });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message } });
        } else {
          throw error;
        }
      }
    }

    return [returnData];
  }
}