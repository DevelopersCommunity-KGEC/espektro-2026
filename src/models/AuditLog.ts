import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  performedBy: mongoose.Types.ObjectId; // User ID
  clubId?: string; // Optional, if club-scoped
  entityId?: string; // ID of the affected entity (Event, Ticket, etc.)
  entityType?: string; // 'Event', 'Ticket', 'User'
  details?: any; // JSON object for extra details
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clubId: { type: String },
    entityId: { type: String },
    entityType: { type: String },
    details: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { capped: { size: 1024 * 1024 * 50 } }, // Optional: Capped collection for logs (50MB)
);

export default mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
