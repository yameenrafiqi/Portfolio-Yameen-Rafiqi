import mongoose from 'mongoose';

export interface IProjectSettings {
  _id?: string;
  userId: string; // To support multiple users in the future
  visibility: {
    [repoId: string]: boolean;
  };
  updatedAt?: Date;
}

const projectSettingsSchema = new mongoose.Schema<IProjectSettings>(
  {
    userId: {
      type: String,
      required: true,
      default: 'default',
      unique: true,
    },
    visibility: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const ProjectSettings = mongoose.models.ProjectSettings || 
  mongoose.model<IProjectSettings>('ProjectSettings', projectSettingsSchema);

export default ProjectSettings;
