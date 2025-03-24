from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sleep_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the SleepRecord model
class SleepRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bedtime = db.Column(db.String(5), nullable=False)
    wakeup_time = db.Column(db.String(5), nullable=False)
    sleep_duration = db.Column(db.Float, nullable=False)
    sleep_quality = db.Column(db.String(10), nullable=False)

# Create the database tables
with app.app_context():
    db.create_all()

# Route to serve the frontend
@app.route('/')
def home():
    return render_template('index.html')

# API endpoint to calculate and save sleep data
@app.route('/save-sleep', methods=['POST'])
def save_sleep():
    try:
        data = request.json
        bedtime = data.get('bedtime')
        wakeup_time = data.get('wakeupTime')

        if not bedtime or not wakeup_time:
            return jsonify({"error": "Both bedtime and wake-up time are required"}), 400

        # Convert times to datetime objects
        from datetime import datetime
        bedtime_date = datetime.strptime(bedtime, '%H:%M')
        wakeup_time_date = datetime.strptime(wakeup_time, '%H:%M')

        if bedtime_date > wakeup_time_date:
            wakeup_time_date = wakeup_time_date.replace(day=wakeup_time_date.day + 1)

        sleep_duration_seconds = (wakeup_time_date - bedtime_date).total_seconds()
        sleep_duration_hours = sleep_duration_seconds / 3600

        sleep_quality = 'Poor' if sleep_duration_hours < 6 else 'Good' if sleep_duration_hours < 8 else 'Excellent'

        # Save data to the database
        record = SleepRecord(
            bedtime=bedtime,
            wakeup_time=wakeup_time,
            sleep_duration=sleep_duration_hours,
            sleep_quality=sleep_quality
        )
        db.session.add(record)
        db.session.commit()

        return jsonify({"message": "Sleep data saved successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)