from flask import Flask, request, jsonify
import pandas as pd
import joblib
from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from twilio.rest import Client

# Load dataset
data = pd.read_csv('asthma_dataset.csv')

# Prepare features and target
X = data.drop('AsthmaRisk', axis=1)
y = data['AsthmaRisk']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Train model
model = CatBoostClassifier(iterations=100, depth=5, learning_rate=0.1, loss_function='MultiClass', verbose=False)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "model.pkl")

app = Flask(__name__)
@app.route('/')
def home():
    return "Flask app is running successfully!"

# Load trained model
model = joblib.load("model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    input_data = pd.DataFrame([data])
    prediction = model.predict(input_data)[0]
    
    severity_map = {0: "Low", 1: "Moderate", 2: "Severe"}
    result = severity_map[int(prediction)]
    
    return jsonify({'severity': result})

@app.route('/send_sms', methods=['POST'])
def send_sms():
    twilio_sid = "your_twilio_sid"
    twilio_auth_token = "your_twilio_auth_token"
    client = Client(twilio_sid, twilio_auth_token)

    data = request.json
    phone_number = data.get('phone')
    severity = data.get('severity')

    message = client.messages.create(
        body=f"Your predicted asthma severity is {severity}. Please consult a doctor if necessary.",
        from_="+your_twilio_phone_number",
        to=phone_number
    )
    
    return jsonify({"message": "SMS sent successfully!", "sid": message.sid})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
