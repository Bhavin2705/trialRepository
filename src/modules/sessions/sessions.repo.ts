import { ISession, Session } from '../../shared/models/Session';

export class SessionsRepository {
    static async create(sessionData: {
        userId: string;
        title: string;
        description?: string;
        type: 'technical' | 'behavioral' | 'mixed';
        difficulty: 'easy' | 'medium' | 'hard';
    }): Promise<ISession> {
        try {
            const session = new Session({
                ...sessionData,
                status: 'draft',
                questions: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return await session.save();
        } catch (error: any) {
            throw new Error('Error creating session');
        }
    }

    static async findByUserId(userId: string, options?: {
        page?: number;
        limit?: number;
        sort?: string;
        order?: 'asc' | 'desc';
        status?: string;
        type?: string;
    }): Promise<{ sessions: ISession[]; total: number }> {
        try {
            const page = options?.page || 1;
            const limit = options?.limit || 10;
            const skip = (page - 1) * limit;

            const sortField = options?.sort || 'createdAt';
            const sortOrder = options?.order === 'asc' ? 1 : -1;
            const sortObj: any = {};
            sortObj[sortField] = sortOrder;

            const filter: any = { userId };
            if (options?.status) filter.status = options.status;
            if (options?.type) filter.type = options.type;

            const [sessions, total] = await Promise.all([
                Session.find(filter)
                    .sort(sortObj)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                Session.countDocuments(filter)
            ]);

            return { sessions: sessions as ISession[], total };
        } catch (error: any) {
            throw new Error('Error finding sessions by user ID');
        }
    }

    static async findById(id: string): Promise<ISession | null> {
        try {
            return await Session.findById(id);
        } catch (error: any) {
            throw new Error('Error finding session by ID');
        }
    }

    static async updateById(id: string, data: Partial<ISession>): Promise<ISession | null> {
        try {
            return await Session.findByIdAndUpdate(
                id,
                { ...data, updatedAt: new Date() },
                { new: true }
            );
        } catch (error: any) {
            throw new Error('Error updating session');
        }
    }

    static async deleteById(id: string): Promise<boolean> {
        try {
            const result = await Session.findByIdAndDelete(id);
            return !!result;
        } catch (error: any) {
            throw new Error('Error deleting session');
        }
    }

    static async findByIdAndUserId(id: string, userId: string): Promise<ISession | null> {
        try {
            return await Session.findOne({ _id: id, userId });
        } catch (error: any) {
            throw new Error('Error finding session by ID and user ID');
        }
    }

    static async updateStatus(id: string, status: string, additionalData?: any): Promise<ISession | null> {
        try {
            const updateData: any = { status, updatedAt: new Date() };

            if (status === 'in_progress') {
                updateData.startedAt = new Date();
            } else if (status === 'completed') {
                updateData.endedAt = new Date();
                if (updateData.startedAt) {
                    updateData.duration = (updateData.endedAt.getTime() - updateData.startedAt.getTime()) / 1000;
                }
            }

            if (additionalData) {
                Object.assign(updateData, additionalData);
            }

            return await Session.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error: any) {
            throw new Error('Error updating session status');
        }
    }

    static async addAnalysis(id: string, analysis: {
        overallScore: number;
        feedback: string;
        strengths: string[];
        improvements: string[];
        technicalScore?: number;
        communicationScore?: number;
        confidenceScore?: number;
    }): Promise<ISession | null> {
        try {
            return await Session.findByIdAndUpdate(
                id,
                { analysis, updatedAt: new Date() },
                { new: true }
            );
        } catch (error: any) {
            throw new Error('Error adding session analysis');
        }
    }
}

export default SessionsRepository;