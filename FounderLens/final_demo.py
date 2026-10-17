from sentence_transformers import SentenceTransformer, util
import time

print("FounderLens AI - Final Demo")
print("="*55)

model = SentenceTransformer('all-MiniLM-L6-v2')

def analyze_idea(problem: str, solution: str):
    start = time.time()
    embedding_p = model.encode(problem, convert_to_tensor=True)
    embedding_s = model.encode(solution, convert_to_tensor=True)
    similarity = util.cos_sim(embedding_p, embedding_s).item() * 100
    
    clarity = min(92, int(similarity * 0.9 + 30))
    
    if similarity > 78:
        ai_status = "NECESSARY"
        status_mark = "[+]"
    elif similarity > 55:
        ai_status = "APPROPRIATE"
        status_mark = "[!]"
    else:
        ai_status = "OVER-ENGINEERED"
        status_mark = "[X]"
    
    print(f"\nProblem  : {problem}")
    print(f"Solution: {solution}")
    print(f"Clarity Score : {clarity}/100")
    print(f"Match Score   : {similarity:.1f}/100")
    print(f"AI Status     : {status_mark} {ai_status}")
    print(f"Time taken   : {time.time()-start:.2f} seconds")
    print("-"*55)

# =============== RUN DEMO ===============
if __name__ == "__main__":
    test_ideas = [
        ("Small clinics lose 30% of patients because of 48 hour appointment delays costing them $2400 per month.",
         "AI-powered SMS chatbot that automatically schedules appointments in under 30 seconds."),
        
        ("Freelancers waste too much time chasing payments.",
         "Simple reminder emails."),
        
        ("Healthcare system is inefficient.",
         "We will build a blockchain + AI platform.")
    ]
    
    for p, s in test_ideas:
        analyze_idea(p, s)
