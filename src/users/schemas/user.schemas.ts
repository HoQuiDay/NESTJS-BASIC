import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;
  @Prop({ unique: true })
  email: string;
  @Prop()
  password: string;
  @Prop()
  age: number;
  @Prop()
  gender: number;
  @Prop()
  company: string;
  @Prop()
  role: string;
  @Prop()
  refreshToken: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  isDeleted: boolean;
  @Prop()
  deletedAt: Date;
  @Prop({ type: Object })
  createdBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
  @Prop({ type: Object })
  updatedBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
  @Prop({ type: Object })
  deleteBy: { _id: mongoose.Schema.Types.ObjectId; email: string };
}
export const UserSchema = SchemaFactory.createForClass(User);
