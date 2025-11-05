const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;

export class ScheduledTasks {
    private static intervals: NodeJS.Timeout[] = [];

    static start(): void {
        const fileCleanupInterval = setInterval(() => {
            console.log('Running scheduled file cleanup...');
        }, CLEANUP_INTERVAL);

        this.intervals.push(fileCleanupInterval);

        console.log('📅 Scheduled tasks started');
    }

    static stop(): void {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        console.log('📅 Scheduled tasks stopped');
    }
}

export default ScheduledTasks;