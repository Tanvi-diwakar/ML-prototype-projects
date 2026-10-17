# setup_and_train.py
import json
import random
from tqdm import tqdm
from sentence_transformers import SentenceTransformer, InputExample, losses, util
from torch.utils.data import DataLoader
from sklearn.model_selection import train_test_split

print("FounderLens AI - SIMPLE TRAINING")
print("="*60)

# 1. Generate Data
print("\nGenerating data...")
data = []
for i in tqdm(range(600)):
    if random.random() > 0.4:
        problem = "Small clinics lose 30% patients due to long appointment delays."
        solution = "AI chatbot that books appointments instantly via SMS."
        score = random.randint(80, 95)
    else:
        problem = "Healthcare is bad."
        solution = "Use AI and blockchain."
        score = random.randint(25, 55)
    
    data.append({"problem": problem, "solution": solution, "score": score})

with open("startup_data.jsonl", "w") as f:
    for d in data:
        f.write(json.dumps(d) + "\n")

print(f"Data saved: {len(data)} examples")

# 2. Train Model
print("\nTraining model... (5-12 minutes)")

examples = [InputExample(texts=[d["problem"], d["solution"]], label=d["score"]/100.0) for d in data]

train_ex, val_ex = train_test_split(examples, test_size=0.2, random_state=42)

model = SentenceTransformer('all-MiniLM-L6-v2')

train_dataloader = DataLoader(train_ex, shuffle=True, batch_size=32)

loss = losses.CosineSimilarityLoss(model)

model.fit(
    train_objectives=[(train_dataloader, loss)],
    epochs=2,                    # Reduced to 2 for speed
    warmup_steps=50,
    output_path="match_model",
    show_progress_bar=True
)

print("\nTRAINING DONE!")
print("Model saved in 'match_model' folder")

# 3. Test
print("\nTesting...")
model = SentenceTransformer("match_model")

p = "Small clinics lose patients due to long wait times"
s = "AI chatbot for instant booking"
embedding_p = model.encode(p, convert_to_tensor=True)
embedding_s = model.encode(s, convert_to_tensor=True)
score = util.cos_sim(embedding_p, embedding_s).item() * 100
print(f"Test Score: {score:.1f}/100")