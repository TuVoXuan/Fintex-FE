import { ReactionEnum } from '../constants/reaction';

export const findReaction = (reactions: IReaction[], type: ReactionEnum) => {
    const index = reactions.findIndex((item) => item.type === type);
    return index;
};
