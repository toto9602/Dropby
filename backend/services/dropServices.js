const { Drop, Image, Emoji, LikeDrop, Place } = require("../models");
const { getUserWithAccess } = require("../utils/auth");
const { getWrittenPlaceName } = require("../utils/place");


exports.newDrop = async (accessToken, body, files, placePk) => {
  const user = await getUserWithAccess(accessToken);
  let {title, content, emojiSlug, isPrivate} = body;
  isPrivate = (isPrivate === 'true');
  
  const emoji = await Emoji.findOne({
    where:{
      slug:emojiSlug
    }
  })

  const drop = await Drop.create({
    title,
    content,
    createdAt: Date(),
    creatorPk: user.pk,
    placePk,
    emojiPk:emoji.pk,
    isPrivate
    });
  if (files) {
    for (let image of files) {
      const drop_image = await Image.create({
        imageUrl:image.location,
        dropPk:drop.pk
    });
    }
  }

  return drop;
};

exports.getDrops = async (accessToken, placePk) => {
  const publicDrops = await Drop.findAll({
    where: {
      placePk,
      isPrivate:false,
    },
    include:["images", "emoji"],
  });

  const user = await getUserWithAccess(accessToken);

  const myDrops = await Drop.findAll({
    where:{
      placePk,
      isPrivate:true,
      creatorPk:user.pk
    },
    include:["images", "emoji"],
  })
  const writtenPlace = await getWrittenPlaceName(publicDrops[0]);
  const dropsCount = publicDrops.length + myDrops.length;

  return {
    writtenPlace,
    dropsCount,
    publicDrops,
    myDrops
  }
}
exports.getPublicDrops = async (accessToken, placePk) => {
  const publicDrops = await Drop.findAll({
    where:{
      placePk,
      isPrivate:false,
    },
    include:["images", "emoji"]
  });

  const writtenPlace = await getWrittenPlaceName(publicDrops[0]);
  const dropsCount = publicDrops.length;

  return {
          writtenPlace,
          dropsCount,
          publicDrops,
          };
};

exports.getMyDrops = async (accessToken, placePk) => {
  const user = await getUserWithAccess(accessToken);

  const myDrops = await Drop.findAll({
    where: {
      placePk,
      isPrivate:true,
      creatorPk:user.pk
    },
    include:["images", "emoji"],
  });

  const writtenPlace = await getWrittenPlaceName(myDrops[0]);
  const dropsCount = myDrops.length;
  return {
    writtenPlace,
    dropsCount, 
    myDrops
  }
}
exports.updateDrop = async (body, files, dropPk) => {
  const {title, content} = body;
  const drop = await Drop.findOne({
    where:{
      pk:dropPk
    },
  });

  drop.set({
    title:title,
    content:content
  })
  await drop.save();
  Image.destroy({
    where: {
      dropPk:drop.pk
    }
  })
  if (files) {
    for (let image of files) {
      const drop_image = await Image.create({
        imageUrl:image.location,
        dropPk:drop.pk
    });
    }
  }
  // s3에서 이미지 삭제하는 로직 필요할까?
  return drop;

}

exports.deleteDrop = async (dropPk) => {
  const drop = await Drop.findOne({
    where:{
      pk:dropPk
    }
  });

  await drop.destroy();
  return true;
}

exports.getDrop = async (accessToken, dropPk) => {
  const drop = await Drop.findOne({
    where:{
      pk:dropPk
    }, include: ["emoji", "images", { model: Place, attributes: ['name'] }]
  });

  const user = await getUserWithAccess(accessToken);

  const dropLiked = await LikeDrop.findAll({
    where:{
      DropPk:dropPk,
      UserPk:user.pk
    }
  });
  const writtenPlace = await getWrittenPlaceName(drop);

  if (dropLiked.length > 0) {
    return {
    writtenPlace:writtenPlace,
    drop:drop,
    isLiked:true
  }
}
  return {
    writtenPlace:writtenPlace,
    drop:drop,
    isLiked:false
  }
}

exports.toggleDropLike = async (accessToken, dropPk) => {
  const user = await getUserWithAccess(accessToken);

  const likeDrop = await LikeDrop.findOne({
    where:{
      dropPk:dropPk,
      userPk:user.pk
    },
  });

  const drop = await Drop.findOne({
    where:{
      pk:dropPk
    }
  });

  if (likeDrop) {
    drop.set({
      likesCount:drop.likesCount - 1
    });

    await drop.save();
    await likeDrop.destroy();
    return 'OFF';
  }
    drop.set({
      likesCount:drop.likesCount + 1
    });

    await drop.save();

    const dropLiked = await LikeDrop.create({
      DropPk:dropPk,
      UserPk:user.pk
    })
    return 'ON';
  
}