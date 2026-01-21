import type { INodeProperties } from 'n8n-workflow';
import { messageCreateDescription } from './create';

const showOnlyForUsers = {
	resource: ['message'],
};

export const messageDescription: INodeProperties[] = [
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
	...messageCreateDescription,
];
