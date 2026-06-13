const News = require("../models/news.model");
const { z } = require("zod");

const newsCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const newsUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

module.exports.addNews = async (req, res, next) => {
  try {
    const parse = newsCreateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid news data",
        errors: parse.error.issues,
      });
    }

    const { title, content } = parse.data;

    const news = new News({
      title,
      content,
    });

    await news.save();

    res.status(201).json({
      success: true,
      message: "News entry created successfully",
      news,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllNews = async (req, res, next) => {
  try {
    const newsList = await News.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      newsList,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateNews = async (req, res, next) => {
  try {
    const parse = newsUpdateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid update data",
        errors: parse.error.issues,
      });
    }

    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News entry not found",
      });
    }

    const { title, content } = parse.data;

    if (title) news.title = title;
    if (content) news.content = content;

    await news.save();

    res.status(200).json({
      success: true,
      message: "News entry updated successfully",
      news,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News entry not found",
      });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: "News entry deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};