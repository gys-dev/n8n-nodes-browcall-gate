"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageCreateDescription = void 0;
const showOnlyForMessageCreate = {
    operation: ['create'],
    resource: ['message'],
};
exports.messageCreateDescription = [
    {
        displayName: 'Message',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: showOnlyForMessageCreate,
        },
        description: 'The message to send',
        routing: {
            send: {
                type: 'body',
                property: 'message',
            },
        },
    },
    {
        displayName: 'Output Format',
        name: 'format',
        type: 'options',
        options: [
            {
                name: 'Plain Text',
                value: 'plain',
            },
            {
                name: 'JSON',
                value: 'json',
            },
            {
                name: 'Markdown',
                value: 'markdown',
            },
            {
                name: 'Image',
                value: 'image',
            },
        ],
        default: 'plain',
        required: true,
        routing: {
            send: {
                type: 'body',
                property: 'outputFormat',
            },
        },
    },
];
//# sourceMappingURL=create.js.map