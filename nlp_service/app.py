from flask import Flask, request, jsonify
import spacy

nlp = spacy.load('en_core_web_sm')

app = Flask(__name__)

@app.route('/detect_entities', methods=['POST'])
def detect_entities():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
#process text with spacy
    doc = nlp(text)
    entities = [{'entity': ent.text, 'label': ent.label_} for ent in doc.ents]

    return jsonify({'entities': entities})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)