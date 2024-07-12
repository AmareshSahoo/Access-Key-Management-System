import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Log extends Document {
  @Prop()
  key: string;

  @Prop()
  timestamp: Date;

  @Prop()
  success: boolean;

  @Prop()
  message: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
