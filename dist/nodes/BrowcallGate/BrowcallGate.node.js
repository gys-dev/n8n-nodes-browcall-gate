"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowcallGate = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const message_1 = require("./resources/message");
class BrowcallGate {
    constructor() {
        this.description = {
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
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
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
                ...message_1.messageDescription,
            ],
        };
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                const operation = this.getNodeParameter('operation', i);
                const name = this.getNodeParameter('name', i);
                const format = this.getNodeParameter('format', i);
                const baseUrlInput = this.getNodeParameter('baseUrl', i);
                let properties = [];
                if (resource === 'message') {
                    properties = message_1.messageDescription;
                }
                const opField = properties.find((d) => d.name === 'operation');
                const opConfig = (_a = opField === null || opField === void 0 ? void 0 : opField.options) === null || _a === void 0 ? void 0 : _a.find((o) => o.value === operation);
                const methodFromConfig = ((_d = (_c = (_b = opConfig === null || opConfig === void 0 ? void 0 : opConfig.routing) === null || _b === void 0 ? void 0 : _b.request) === null || _c === void 0 ? void 0 : _c.method) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || 'POST';
                const method = (['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].includes(methodFromConfig)
                    ? methodFromConfig
                    : 'POST');
                const urlPath = ((_f = (_e = opConfig === null || opConfig === void 0 ? void 0 : opConfig.routing) === null || _e === void 0 ? void 0 : _e.request) === null || _f === void 0 ? void 0 : _f.url) || 'chat/completions';
                const cleanBase = baseUrlInput.replace(/\/+$/, '');
                const cleanPath = urlPath.replace(/^\/+/, '');
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
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                }
                else {
                    throw error;
                }
            }
        }
        return [returnData];
    }
}
exports.BrowcallGate = BrowcallGate;
//# sourceMappingURL=BrowcallGate.node.js.map