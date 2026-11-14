import random
from datetime import datetime, timedelta

def get_random_date():
    start = datetime.now() - timedelta(days=60)
    end = datetime.now()
    random_date = start + (end - start) * random.random()
    return random_date.strftime('%Y-%m-%d %H:%M:%S')

def get_future_date():
    start = datetime.now() + timedelta(days=10)
    end = datetime.now() + timedelta(days=60)
    random_date = start + (end - start) * random.random()
    return random_date.strftime('%Y-%m-%d %H:%M:%S')

bcrypt_password = "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCG3JZG1R.q9yT9JbXoOu" # "password"

sql = []

# 1. 10 Clients (IDs 1-10)
for i in range(1, 11):
    sql.append(f"INSERT INTO users (id, username, email, password, role) VALUES ({i}, 'client{i}', 'client{i}@example.com', '{bcrypt_password}', 'CLIENT');")

# 2. 20 Freelancers (IDs 11-30)
for i in range(11, 31):
    sql.append(f"INSERT INTO users (id, username, email, password, role) VALUES ({i}, 'freelancer{i}', 'freelancer{i}@example.com', '{bcrypt_password}', 'FREELANCER');")
    # Freelancer Profiles
    sql.append(f"INSERT INTO freelancer_profiles (id, user_id, title, bio, hourly_rate) VALUES ({i-10}, {i}, 'Expert Developer', 'I build great things.', {random.randint(20, 150)});")

# 3. 50 Projects
project_titles = ["E-commerce Website", "Mobile App UI", "Backend API", "Data Analysis", "SEO Optimization", "Logo Design", "Copywriting", "React Frontend", "Smart Contract", "DevOps Setup"]
for i in range(1, 51):
    client_id = random.randint(1, 10)
    title = random.choice(project_titles) + f" {i}"
    budget = random.randint(500, 5000)
    status = "OPEN"
    sql.append(f"INSERT INTO projects (id, client_id, title, description, budget, status, created_at) VALUES ({i}, {client_id}, '{title}', 'Looking for an expert to help with {title}.', {budget}, '{status}', '{get_random_date()}');")

# 4. 100 Bids
for i in range(1, 101):
    project_id = random.randint(1, 50)
    freelancer_id = random.randint(11, 30)
    amount = random.randint(100, 4000)
    status = "PENDING"
    sql.append(f"INSERT INTO bids (id, project_id, freelancer_id, amount, proposal, status, created_at) VALUES ({i}, {project_id}, {freelancer_id}, {amount}, 'I can deliver this project quickly.', '{status}', '{get_random_date()}');")

# 5. 20 Contracts
for i in range(1, 21):
    # For simplicity, assign to first 20 bids
    bid_id = i
    # We must know the project_id and freelancer_id for this bid. We know bid_id i goes to project (i % 50) or something.
    # To be safe, we'll just hardcode some valid IDs.
    project_id = i
    freelancer_id = 10 + (i % 20) + 1
    amount = 1000 + i * 10
    
    # Update project status to IN_PROGRESS
    sql.append(f"UPDATE projects SET status='IN_PROGRESS' WHERE id={project_id};")
    # Update bid status to ACCEPTED
    sql.append(f"UPDATE bids SET status='ACCEPTED', freelancer_id={freelancer_id}, project_id={project_id} WHERE id={bid_id};")
    
    sql.append(f"INSERT INTO contracts (id, project_id, client_id, freelancer_id, bid_id, amount, status, start_date, end_date) VALUES ({i}, {project_id}, (SELECT client_id FROM projects WHERE id={project_id}), {freelancer_id}, {bid_id}, {amount}, 'ACTIVE', '{get_random_date()}', '{get_future_date()}');")

with open('src/main/resources/data.sql', 'w') as f:
    f.write('\n'.join(sql))

print("data.sql generated successfully")
