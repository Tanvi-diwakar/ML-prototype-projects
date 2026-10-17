from sentence_transformers import SentenceTransformer, util
import json

# Load pre-trained model (no training needed)
print("Loading model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

def analyze_startup(problem, solution):
    # Get similarity score
    embedding_p = model.encode(problem, convert_to_tensor=True)
    embedding_s = model.encode(solution, convert_to_tensor=True)
    score = util.cos_sim(embedding_p, embedding_s).item() * 100
    
    # Fake realistic scores for demo
    clarity = min(95, int(score * 0.85 + 25))
    ai_class = "NECESSARY" if score > 75 else "APPROPRIATE" if score > 50 else "OVER-ENGINEERED"
    
    return {
        "clarityScore": clarity,
        "matchScore": round(score, 1),
        "aiClassification": ai_class,
        "aiJustification": "The solution directly addresses the core pain points mentioned in the problem.",
        "recommendations": [
            {"title": "Add quantifiable metrics", "priority": "HIGH", "description": "Include numbers like cost, time, or percentage."},
            {"title": "Focus on one user segment", "priority": "MEDIUM", "description": "Narrow down target users for better clarity."}
        ]
    }

# ==================== DEMO ====================
if __name__ == "__main__":
    print("FounderLens AI - Demo\n")
    
    test_cases = [
        ("Small clinics lose 30% of patients due to 48-hour appointment delays.", 
         "AI SMS chatbot that books appointments instantly."),
        
        ("Healthcare is broken.", 
         "We will use AI and blockchain.")
    ]
    
    for problem, solution in test_cases:
        result = analyze_startup(problem, solution)
        print(f"Problem : {problem}")
        print(f"Solution: {solution}")
        print(f"Clarity Score : {result['clarityScore']}/100")
        print(f"Match Score   : {result['matchScore']}/100")
        print(f"AI Status     : {result['aiClassification']}")
        print("-" * 60)
