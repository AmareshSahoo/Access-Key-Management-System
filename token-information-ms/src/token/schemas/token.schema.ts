import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Token extends Document {
  @Prop({ required: true })
  keyValue: string;

  @Prop({ required: true })
  rateLimit: number;

  @Prop({ required: true })
  expirationTime: Date;

  @Prop({ default: false })
  disabled: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
