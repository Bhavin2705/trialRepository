import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
    userId: string;
    title: string;
    description?: string;
    type: 'technical' | 'behavioral' | 'mixed';
    difficulty: 'easy' | 'medium' | 'hard';
    status: string;
    scheduledAt?: Date;
    startedAt?: Date;
    endedAt?: Date;
    duration?: number;
    questions: any[];
    recording?: any;
    analysis?: any;
    transcript?: string;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['technical', 'behavioral', 'mixed']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard']
    },
    status: {
        type: String,
        default: 'draft',
        enum: ['draft', 'scheduled', 'in_progress', 'completed', 'cancelled']
    },
    scheduledAt: Date,
    startedAt: Date,
    endedAt: Date,
    duration: {
        type: Number,
        default: 0
    },
    questions: [{
        question: String,
        category: String,
        difficulty: String,
        answer: String,
        feedback: String,
        score: Number
    }],
    company: String,
    role: String,
    jobDescription: String,
    recording: {
        filename: String,
        path: String,
        duration: Number,
        size: Number
    },
    analysis: {
        overallScore: Number,
        feedback: String,
        strengths: [String],
        improvements: [String],
        technicalScore: Number,
        communicationScore: Number,
        confidenceScore: Number
    }
    ,
    transcript: String
}, {
    timestamps: true
});

sessionSchema.index({ userId: 1 });
sessionSchema.index({ status: 1 });

export const Session = mongoose.model<ISession>('Session', sessionSchema);
export default Session;