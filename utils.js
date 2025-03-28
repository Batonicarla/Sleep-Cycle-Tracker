class SleepTrackerUtils {
    static formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    static validateSleepData(data) {
        const errors = [];

        if (!data.bedTime) errors.push('Bed time is required');
        if (!data.wakeTime) errors.push('Wake time is required');

        // Time format validation
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(data.bedTime)) errors.push('Invalid bed time format');
        if (!timeRegex.test(data.wakeTime)) errors.push('Invalid wake time format');

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    static generateSleepReport(sleepTrends) {
        const report = `
            Sleep Report:
            - Average Sleep Duration: ${sleepTrends.averageSleepDuration.toFixed(2)} hours
            - Average Sleep Quality: ${sleepTrends.averageSleepQuality.toFixed(2)}/100
        `;
        return report;
    }
}

export default SleepTrackerUtils;