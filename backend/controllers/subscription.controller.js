const Subscriber = require("../models/subscriber.model");
const { z } = require("zod");

const subscribeSchema = z.object({
  email: z.string().email().lowercase().trim(),
});

const broadcastSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
});

module.exports.subscribe = async (req, res, next) => {
  try {
    const parse = subscribeSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
        errors: parse.error.issues,
      });
    }

    const { email } = parse.data;

    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.status === "ACTIVE") {
        return res.status(400).json({
          success: false,
          message: "You are already subscribed to the newsletter",
        });
      }
      subscriber.status = "ACTIVE";
    } else {
      subscriber = new Subscriber({ email });
    }

    await subscriber.save();


    //Todo - Integrate with actual ESP to send welcome email
    console.log(`[ESP MOCK] Triggering welcome email to: ${email}`);

    res.status(200).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.unsubscribe = async (req, res, next) => {
  try {
    const parse = subscribeSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
        errors: parse.error.issues,
      });
    }

    const { email } = parse.data;

    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber || subscriber.status === "UNSUBSCRIBED") {
      return res.status(400).json({
        success: false,
        message: "Email is not actively subscribed",
      });
    }

    subscriber.status = "UNSUBSCRIBED";
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "Unsubscribed successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.broadcast = async (req, res, next) => {
  try {
    const parse = broadcastSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid broadcast data",
        errors: parse.error.issues,
      });
    }

    const { subject, body } = parse.data;

    const activeSubscribers = await Subscriber.find({ status: "ACTIVE" }).select("email");

    if (activeSubscribers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active subscribers found to broadcast to",
      });
    }

    const emails = activeSubscribers.map((sub) => sub.email);

    //Todo - Integrate with actual ESP to send broadcast email

    console.log(`Broadcasting email to ${emails.length} subscribers.`);
    console.log(`Subject: ${subject}`);

    res.status(200).json({
      success: true,
      message: `Broadcast initiated successfully to ${emails.length} subscribers`,
    });
  } catch (err) {
    next(err);
  }
};


module.exports.getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, subscribers });
  } catch (err) {
    next(err);
  }
};