import SessionsRepository from './sessions.repo';

export class SessionsService {
    static async createSession(userId: string, sessionData: any) {
        try {
            const session = await SessionsRepository.create({
                userId,
                ...sessionData
            });

            return {
                session: {
                    id: session._id,
                    title: session.title,
                    description: session.description,
                    type: session.type,
                    difficulty: session.difficulty,
                    status: session.status,
                    createdAt: session.createdAt
                }
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to create session');
        }
    }

    static async getUserSessions(userId: string, query: any = {}) {
        try {
            const { sessions, total } = await SessionsRepository.findByUserId(userId, query);

            const page = query.page || 1;
            const limit = query.limit || 10;
            const pages = Math.ceil(total / limit);

            return {
                sessions: sessions.map((session: any) => ({
                    id: session._id,
                    userId: session.userId,
                    title: session.title,
                    description: session.description,
                    type: session.type,
                    difficulty: session.difficulty,
                    status: session.status,
                    startedAt: session.startedAt,
                    endedAt: session.endedAt,
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt,
                    duration: session.duration,
                    analysis: session.analysis
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    pages
                }
            };
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve sessions');
        }
    }

    static async getSession(sessionId: string, userId: string) {
        const session = await SessionsRepository.findByIdAndUserId(sessionId, userId);
        if (!session) {
            throw new Error('Session not found or access denied');
        }

        return {
            id: session._id,
            title: session.title,
            description: session.description,
            type: session.type,
            difficulty: session.difficulty,
            status: session.status,
            questions: session.questions,
            recording: session.recording,
            analysis: session.analysis,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            startedAt: session.startedAt,
            endedAt: session.endedAt,
            duration: session.duration
        };
    }

    static async updateSession(sessionId: string, userId: string, updateData: any) {
        const existingSession = await SessionsRepository.findByIdAndUserId(sessionId, userId);
        if (!existingSession) {
            throw new Error('Session not found or access denied');
        }

        const updatedSession = await SessionsRepository.updateById(sessionId, updateData);
        if (!updatedSession) {
            throw new Error('Failed to update session');
        }

        return {
            id: updatedSession._id,
            title: updatedSession.title,
            description: updatedSession.description,
            type: updatedSession.type,
            difficulty: updatedSession.difficulty,
            status: updatedSession.status,
            updatedAt: updatedSession.updatedAt
        };
    }

    static async deleteSession(sessionId: string, userId: string) {
        const existingSession = await SessionsRepository.findByIdAndUserId(sessionId, userId);
        if (!existingSession) {
            throw new Error('Session not found or access denied');
        }

        const deleted = await SessionsRepository.deleteById(sessionId);
        if (!deleted) {
            throw new Error('Failed to delete session');
        }

        return true;
    }

    static async startSession(sessionId: string, userId: string) {
        const existingSession = await SessionsRepository.findByIdAndUserId(sessionId, userId);
        if (!existingSession) {
            throw new Error('Session not found or access denied');
        }

        if (existingSession.status !== 'draft') {
            throw new Error('Session cannot be started from current status');
        }

        const updatedSession = await SessionsRepository.updateStatus(sessionId, 'in_progress');
        if (!updatedSession) {
            throw new Error('Failed to start session');
        }

        return {
            id: updatedSession._id,
            status: updatedSession.status,
            startedAt: updatedSession.startedAt
        };
    }

    static async endSession(sessionId: string, userId: string) {
        const existingSession = await SessionsRepository.findByIdAndUserId(sessionId, userId);
        if (!existingSession) {
            throw new Error('Session not found or access denied');
        }

        if (existingSession.status !== 'in_progress') {
            throw new Error('Session is not currently in progress');
        }

        const updatedSession = await SessionsRepository.updateStatus(sessionId, 'completed');
        if (!updatedSession) {
            throw new Error('Failed to end session');
        }

        return {
            id: updatedSession._id,
            status: updatedSession.status,
            endedAt: updatedSession.endedAt,
            duration: updatedSession.duration
        };
    }

    static async getSessionAnalysis(sessionId: string, userId: string) {
        const session = await SessionsRepository.findByIdAndUserId(sessionId, userId);
        if (!session) {
            throw new Error('Session not found or access denied');
        }

        if (!session.analysis) {
            throw new Error('Analysis not available for this session');
        }

        return {
            sessionId: session._id,
            overallScore: session.analysis.overallScore,
            feedback: session.analysis.feedback,
            strengths: session.analysis.strengths,
            improvements: session.analysis.improvements,
            technicalScore: session.analysis.technicalScore,
            communicationScore: session.analysis.communicationScore,
            confidenceScore: session.analysis.confidenceScore
        };
    }

    static async storeTranscript(sessionId: string, userId: string, transcript: string) {
        const session = await SessionsRepository.findByIdAndUserId(sessionId, userId)
        if (!session) throw new Error('Session not found')
        await SessionsRepository.updateById(sessionId, { transcript })
        return { sessionId, transcript }
    }

    static async generateAnalysis(sessionId: string, userId: string) {
        const session = await SessionsRepository.findByIdAndUserId(sessionId, userId)
        if (!session) throw new Error('Session not found')
        const transcript = session.transcript || ''
        // call OpenRouter/OpenAI via fetch
        const axios = require('axios')
        const { env } = require('../../core/env')
        const prompt = `You are an interviewer assistant. Provide concise feedback, strengths, improvements and 3 follow-up questions for the candidate based on the transcript: ${transcript}`
        const resp = await axios.post(env.OPENROUTER_BASE_URL + '/chat/completions', {
            model: process.env.OPENAI_MODEL || 'openai/gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 800
        }, { headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}` } })
        const analysis = { raw: resp.data, summary: resp.data?.choices?.[0]?.message?.content }
        await SessionsRepository.updateById(sessionId, { analysis })
        return { sessionId, analysis }
    }

    static async generateFollowUp(sessionId: string, userId: string, promptText: string) {
        const session = await SessionsRepository.findByIdAndUserId(sessionId, userId)
        if (!session) throw new Error('Session not found')
        const axios = require('axios')
        const { env } = require('../../core/env')
        const prompt = `You are an interviewer. Based on the transcript: ${session.transcript || ''}. ${promptText || 'Ask a concise follow-up question to probe deeper.'}`
        const resp = await axios.post(env.OPENROUTER_BASE_URL + '/chat/completions', {
            model: process.env.OPENAI_MODEL || 'openai/gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200
        }, { headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}` } })
        const question = resp.data?.choices?.[0]?.message?.content
        return { question, raw: resp.data }
    }
}

export default SessionsService;