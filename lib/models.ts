import mongoose from "mongoose";

mongoose.connection.deleteModel("Auction");
mongoose.connection.deleteModel("Vipps");
mongoose.connection.deleteModel("StreamLink");
mongoose.connection.deleteModel("StretchGoal");
mongoose.connection.deleteModel("Bid");
mongoose.connection.deleteModel("Rulesheet");

const AuctionSchema = new mongoose.Schema(
  {
    id: { type: Number },
    description: { type: String, default: "NULL" },
    price: { type: Number, default: 0 },
    highestBid: { type: String, default: "NULL" },
    title: { type: String, default: "NULL" },
    i: { type: Number },
  },
  { autoCreate: true }
);
export const Auction = mongoose.model("Auction", AuctionSchema);

const VippsSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    amount: { type: Number, default: 0 },
  },
  { autoCreate: true, timestamps: true }
);
export const Vipps = mongoose.model("Vipps", VippsSchema);

const StreamLinkSchema = new mongoose.Schema(
  {
    link: { type: String, default: "" },
  },
  { autoCreate: true }
);
export const StreamLink = mongoose.model("StreamLink", StreamLinkSchema);

const StretchGoalSchema = new mongoose.Schema(
  {
    description: { type: String, default: "" },
    goal: { type: Number, default: 0 },
  },
  { autoCreate: true }
);
export const StretchGoal = mongoose.model("StretchGoal", StretchGoalSchema);

const BidSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    description: { type: String, default: "" },
    item: { type: String, default: "" },
    amount: { type: Number, default: 0 },
  },
  { autoCreate: true, timestamps: true }
);
export const Bid = mongoose.model("Bid", BidSchema);

const RulesheetSchema = new mongoose.Schema(
  {
    markdown: { type: String, default: "" },
  },
  { autoCreate: true, timestamps: true }
);
export const Rulesheet = mongoose.model("Rulesheet", RulesheetSchema);
