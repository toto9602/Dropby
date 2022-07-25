const { Comment } = require("../models");
const { getUserWithAccess } = require("../utils/auth");


exports.newComment = async (accessToken, body, dropPk) => {
    const user = await getUserWithAccess(accessToken);
    const { content } = body;

    const comment = await Comment.create({
        content,
        createdAt: Date(),
        creatorPk: user.pk,
        dropPk,
    });

    return comment;
};

exports.getComments = async (accessToken, dropPk) => {
    const user = await getUserWithAccess(accessToken);

    const comments = await Comment.findAll({
        where: {
            dropPk
        },
    });

    const commentsCount = comments.length;

    return {
        data: comments,
        commentsCount,
    }
}

exports.updateComment = async (body, dropPk, commentPk) => {

    const { content } = body;

    const comment = await Comment.findOne({
        where: {
            pk: commentPk
        },
    });

    comment.set({
        content
    });

    await comment.save();

    return comment;
}

exports.deleteComment = async (commentPk) => {

    const comment = await Comment.findOne({
        where: {
            pk: commentPk
        }
    });

    await comment.destroy();
    return true;
}
