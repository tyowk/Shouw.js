import { Functions, type Interpreter, ParamType } from '../../core';
import type { FunctionData, FunctionResultData } from '../../typings';

export default class Description extends Functions {
	constructor() {
		super({
			name: '$description',
			description: 'Adds an embed description',
			brackets: true,
			params: [
				{
					name: 'description',
					description: 'The description for the embed',
					required: true,
					type: ParamType.String
				},
				{
					name: 'index',
					description: 'The index to add this data to',
					required: false,
					type: ParamType.Number
				}
			]
		} as FunctionData);
	}

	code(ctx: Interpreter, [text, index]: [string, number?]): FunctionResultData {
		index = index ?? 0;
		if (!ctx.embeds) ctx.embeds = [];
		if (!ctx.embeds[index]) ctx.embeds[index] = new ctx.discord.EmbedBuilder();
		ctx.embeds[index].setDescription(text);

		return {
			result: void 0
		};
	}
}
