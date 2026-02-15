import mongoose from 'mongoose';

export interface IBlogPost {
  _id?: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  published: boolean;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  author?: {
    uid: string;
    email: string;
    displayName: string;
  };
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const blogPostSchema = new mongoose.Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft',
    },
    author: {
      uid: { type: String },
      email: { type: String },
      displayName: { type: String },
    },
    submittedAt: {
      type: Date,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost;
