from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Route to serve the frontend
@app.route('/')
def home():
    return render_template('index.html')

# API endpoint to calculate sleep duration
@app.route('/calculate', methods=['POST'])
def calculate_sleep():
    try:
        # Get JSON data from the frontend
        data = request.json
        bedtime = data.get('bedtime')
        wakeup_time = data.get('wakeupTime')

        if not bedtime or not wakeup_time:
            return jsonify({"error": "Both bedtime and wake-up time are required"}), 400

        # Convert times to datetime objects
        from datetime import datetime
        bedtime_date = datetime.strptime(bedtime, '%H:%M')
        wakeup_time_date = datetime.strptime(wakeup_time, '%H:%M')

        # Handle cases where bedtime is after midnight
        if bedtime_date > wakeup_time_date:
            wakeup_time_date = wakeup_time_date.replace(day=wakeup_time_date.day + 1)

        # Calculate sleep duration in hours
        sleep_duration_seconds = (wakeup_time_date - bedtime_date).total_seconds()
        sleep_duration_hours = sleep_duration_seconds / 3600

        # Determine sleep quality
        sleep_quality = 'Poor' if sleep_duration_hours < 6 else 'Good' if sleep_duration_hours < 8 else 'Excellent'

        # Generate recommendations
        recommendations = (
            'Consider going to bed earlier or reducing screen time before bed.' if sleep_duration_hours < 6 else
            'You’re doing well, but aim for at least 8 hours of sleep.' if sleep_duration_hours < 8 else
            'Great job! Keep maintaining a consistent sleep schedule.'
        )

        # Return results as JSON
        return jsonify({
            "sleepDuration": round(sleep_duration_hours, 2),
            "sleepQuality": sleep_quality,
            "recommendations": recommendations
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)