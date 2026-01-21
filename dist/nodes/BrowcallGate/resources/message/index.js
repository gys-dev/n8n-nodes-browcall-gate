"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageDescription = void 0;
const create_1 = require("./create");
const showOnlyForUsers = {
    resource: ['message'],
};
exports.messageDescription = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForUsers,
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                action: 'Create new message',
                description: 'Create a message',
                routing: {
                    request: {
                        method: 'POST',
                        url: 'v1/chat/completions',
                    },
                },
            },
        ],
        default: 'create',
    },
    ...create_1.messageCreateDescription,
];
//# sourceMappingURL=index.js.map