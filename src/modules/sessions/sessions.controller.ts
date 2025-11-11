import { Request, Response } from 'express';
import { SessionsService } from './sessions.service';

export class SessionsController {
    static async createSession(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            const sessionData = req.body;

            const result = await SessionsService.createSession(userId, sessionData);

            res.status(201).json({
                success: true,
                message: 'Session created successfully',
                data: { session: result.session }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getSessions(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            const query = req.query;

            const result = await SessionsService.getUserSessions(userId, query);

            res.status(200).json({
                success: true,
                message: 'Sessions retrieved successfully',
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getSession(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;

            const result = await SessionsService.getSession(id, userId);

            res.status(200).json({
                success: true,
                message: 'Session retrieved successfully',
                data: { session: result }
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateSession(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;
            const updateData = req.body;

            const result = await SessionsService.updateSession(id, userId, updateData);

            res.status(200).json({
                success: true,
                message: 'Session updated successfully',
                data: { session: result }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteSession(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;

            await SessionsService.deleteSession(id, userId);

            res.status(200).json({
                success: true,
                message: 'Session deleted successfully'
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async startSession(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;

            const result = await SessionsService.startSession(id, userId);

            res.status(200).json({
                success: true,
                message: 'Session started successfully',
                data: { session: result }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async endSession(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;

            const result = await SessionsService.endSession(id, userId);

            res.status(200).json({
                success: true,
                message: 'Session ended successfully',
                data: { session: result }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getAnalysis(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;

            const result = await SessionsService.getSessionAnalysis(id, userId);

            res.status(200).json({
                success: true,
                message: 'Analysis retrieved successfully',
                data: { analysis: result }
            });
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async uploadTranscript(req: Request, res: Response) {
        try {
            const { id } = req.params
            const userId = (req as any).user?.id
            const { transcript } = req.body
            const result = await SessionsService.storeTranscript(id, userId, transcript)
            res.status(200).json({ success: true, data: result })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    static async requestAnalysis(req: Request, res: Response) {
        try {
            const { id } = req.params
            const userId = (req as any).user?.id
            const result = await SessionsService.generateAnalysis(id, userId)
            res.status(200).json({ success: true, data: result })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    static async askQuestion(req: Request, res: Response) {
        try {
            const { id } = req.params
            const userId = (req as any).user?.id
            const { prompt } = req.body
            const result = await SessionsService.generateFollowUp(id, userId, prompt)
            res.status(200).json({ success: true, data: result })
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message })
        }
    }
}