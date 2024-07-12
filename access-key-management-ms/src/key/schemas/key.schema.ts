// src/key/schemas/key.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KeyDocument = Key & Document;

@Schema()
export class Key {
  @Prop({ required: true })
  keyValue: string;

  @Prop({ required: true })
  rateLimit: number;

  @Prop({ required: true })
  expirationTime: Date;

  @Prop({ default: false })
  isDisabled: boolean;
}

export const KeySchema = SchemaFactory.createForClass(Key);
