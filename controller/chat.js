import Chat from "../models/chat.js";
import User from "../models/user.js";
import { createError } from "../utils/error.js";

export const accessChat = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return createError(next(400, "UserId param not sent with request"));
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.user.id } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      next(error);
    }
  }
};

export const fetchChats = async (req, res, next) => {
  try {
    const result = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const response = await User.populate(result, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    if (!req.body.users || !req.body.name) {
      return next(createError(400, "Please fill all the fields"));
    }
    const users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return next(
        createError(400, "More than 2 users are required to form a group chat")
      );
    }

    const reqUser = await User.findById({ _id: req.user.id }).select(
      "-password"
    );
    users.push(reqUser);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: reqUser,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    next(error);
  }
};

export const renameGroup = async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password -isAdmin")
      .populate("groupAdmin", "-password -isAdmin");

    if (!updatedChat) {
      return next(createError(404, "Chat Not Found"));
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    next(error);
  }
};

export const addToGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password -isAdmin")
      .populate("groupAdmin", "-password -isAdmin");

    if (!added) {
      return next(createError(400, "Chat Not Found"));
    } else {
      res.status(200).json(added);
    }
  } catch (error) {
    next(error);
  }
};

export const removeFromGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password -isAdmin")
      .populate("groupAdmin", "-password -isAdmin");

    if (!updatedGroup) {
      return next(createError(400, "Chat Not Found"));
    } else {
      res.status(200).json(updatedGroup);
    }
  } catch (error) {
    next(error);
  }
};
