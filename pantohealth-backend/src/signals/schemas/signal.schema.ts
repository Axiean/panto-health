/**
 * signal.schema.ts
 *
 * This file defines the data structure and model for a 'Signal' document
 * as it is stored in the MongoDB collection.
 *
 * It uses decorators from the `@nestjs/mongoose` package to bridge the gap
 * between a TypeScript class and a Mongoose schema. This approach provides
 * strong typing and a clear, declarative structure for our data model.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SignalDocument = Signal & Document;

@Schema({ timestamps: true })
export class Signal {
  @Prop({ required: true, index: true })
  deviceId: string;

  @Prop({ required: true })
  time: Date;

  @Prop({ required: true })
  dataLength: number;

  @Prop({ required: true })
  dataVolume: number; // Size of the original data in bytes
}

// The SchemaFactory creates a Mongoose schema object from our decorated class.
// This schema is then used by the `MongooseModule.forFeature()` method in the module file.
export const SignalSchema = SchemaFactory.createForClass(Signal);
